import { Resend } from 'resend'
import { z } from 'zod'

const schema = z.object({ email: z.string().email() })

const from = () => process.env.EMAIL_FROM ?? 'BOANERGES <orders@example.com>'

export async function POST(req: Request): Promise<Response> {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Valid email required.' }, { status: 400 })
  }

  const { email } = parsed.data
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.warn('[newsletter] RESEND_API_KEY not set — skipping subscription for', email)
    return Response.json({ ok: true })
  }

  const resend = new Resend(key)

  // Add to Resend audience when an audience ID is configured
  const audienceId = process.env.RESEND_AUDIENCE_ID
  if (audienceId) {
    await resend.contacts.create({ email, audienceId, unsubscribed: false })
  }

  // Notify the admin inbox
  const adminTo = process.env.EMAIL_ADMIN_TO
  if (adminTo) {
    await resend.emails.send({
      from: from(),
      to: adminTo,
      subject: 'New Studio Dispatch subscriber',
      html: `<p><strong>${email}</strong> subscribed to the Studio Dispatch.</p>`,
    })
  }

  // Send a welcome note to the subscriber
  await resend.emails.send({
    from: from(),
    to: email,
    subject: 'Welcome to the BOANERGES Studio Dispatch',
    html: `<p>You're on the list. We'll be in touch when there's something worth saying.</p>
           <p style="color:#888;font-size:12px">— BOANERGES</p>`,
  })

  return Response.json({ ok: true })
}
