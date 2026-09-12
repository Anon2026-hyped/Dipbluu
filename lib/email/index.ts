import 'server-only'

import { Resend } from 'resend'
import { adminNotificationEmail, emailFrom, hasResendConfigured, hasTwilioConfigured, resendApiKey, twilio } from '@/lib/env'

function client(): Resend | null {
  const key = resendApiKey
  if (!key) return null
  return new Resend(key)
}

const from = () => emailFrom

export interface OrderEmailSummary {
  orderNumber: string
  email: string
  customerName: string
  total: string // already formatted (e.g. "$22.00")
  items: { title: string; quantity: number }[]
}

function itemsHtml(items: OrderEmailSummary['items']): string {
  return items.map((i) => `<li>${i.quantity} × ${i.title}</li>`).join('')
}

function whatsappBody(order: OrderEmailSummary): string {
  const itemSummary = order.items
    .map((item) => `${item.quantity} × ${item.title}`)
    .join(', ')

  return [
    `New BOANERGES order: ${order.orderNumber}`,
    `Customer: ${order.customerName}`,
    `Email: ${order.email}`,
    `Items: ${itemSummary}`,
    `Total: ${order.total}`,
  ].join('\n')
}

async function send(to: string, subject: string, html: string): Promise<void> {
  if (!hasResendConfigured) {
    console.warn(`[email] RESEND_API_KEY not set — skipping "${subject}" to ${to}`)
    return
  }

  const resend = client()
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY not set — skipping "${subject}" to ${to}`)
    return
  }

  const { error } = await resend.emails.send({ from: from(), to, subject, html })
  if (error) {
    console.error(`[email] failed to send "${subject}" to ${to}: ${error.message}`)
  }
}

async function sendWhatsApp(body: string): Promise<void> {
  if (!hasTwilioConfigured) {
    return
  }

  const accountSid = twilio.accountSid as string
  const authToken = twilio.authToken as string
  const whatsappFrom = twilio.whatsappFrom as string
  const whatsappTo = twilio.whatsappTo as string

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64')
  const params = new URLSearchParams({
    From: whatsappFrom,
    To: whatsappTo,
    Body: body,
  })

  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: params.toString(),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`[whatsapp] Twilio message failed: ${text || res.statusText}`)
  }
}

/** Sent to the customer once payment is confirmed. */
export async function sendOrderConfirmation(order: OrderEmailSummary): Promise<void> {
  await send(
    order.email,
    `Your BOANERGES order ${order.orderNumber} is confirmed`,
    `<h1>Thank you, ${order.customerName}</h1>
     <p>Your order <strong>${order.orderNumber}</strong> is confirmed and entering production.</p>
     <ul>${itemsHtml(order.items)}</ul>
     <p>Total: <strong>${order.total}</strong></p>
     <p>You'll receive shipping details once your prints are dispatched.</p>`,
  )
}

/** Sent to the admin inbox on each newly paid order, plus WhatsApp if configured. */
export async function sendAdminNotification(order: OrderEmailSummary): Promise<void> {
  if (adminNotificationEmail) {
    await send(
      adminNotificationEmail,
      `New paid order ${order.orderNumber}`,
      `<h2>New order ${order.orderNumber}</h2>
       <p>${order.customerName} (${order.email}) — ${order.total}</p>
       <ul>${itemsHtml(order.items)}</ul>`,
    )
  }

  await sendWhatsApp(whatsappBody(order))
}
