import 'server-only'

import { Resend } from 'resend'

function client(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  return new Resend(key)
}

const from = () => process.env.EMAIL_FROM ?? 'BOANERGES <orders@example.com>'

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
  const resend = client()
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY not set — skipping "${subject}" to ${to}`)
    return
  }
  const { error } = await resend.emails.send({ from: from(), to, subject, html })
  if (error) console.error(`[email] failed to send "${subject}":`, error)
}

async function sendWhatsApp(body: string): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_WHATSAPP_FROM
  const to = process.env.TWILIO_WHATSAPP_TO

  if (!accountSid || !authToken || !from || !to) {
    return
  }

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64')
  const params = new URLSearchParams({
    From: from,
    To: to,
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
    console.error('[whatsapp] Twilio message failed:', text || res.statusText)
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
  const to = process.env.EMAIL_ADMIN_TO
  if (to) {
    await send(
      to,
      `New paid order ${order.orderNumber}`,
      `<h2>New order ${order.orderNumber}</h2>
       <p>${order.customerName} (${order.email}) — ${order.total}</p>
       <ul>${itemsHtml(order.items)}</ul>`,
    )
  }

  await sendWhatsApp(whatsappBody(order))
}
