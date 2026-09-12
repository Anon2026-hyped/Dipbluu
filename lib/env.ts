import { z } from 'zod'

const publicSchema = z.object({
  siteUrl: z.string().url().default('http://localhost:3000'),
})

export const publicEnv = publicSchema.parse({
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
})

export const emailFrom = process.env.EMAIL_FROM ?? 'BOANERGES <orders@example.com>'
export const adminNotificationEmail = process.env.EMAIL_ADMIN_TO

export const resendApiKey = process.env.RESEND_API_KEY
export const twilio = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  whatsappFrom: process.env.TWILIO_WHATSAPP_FROM,
  whatsappTo: process.env.TWILIO_WHATSAPP_TO,
} as const

export const hasResendConfigured = Boolean(resendApiKey)
export const hasTwilioConfigured = Boolean(
  twilio.accountSid && twilio.authToken && twilio.whatsappFrom && twilio.whatsappTo,
)
