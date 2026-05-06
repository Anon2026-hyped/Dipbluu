import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const order = await request.json()
  return NextResponse.json({ success: true, order })
}
// No default export: Next.js app router API routes should only export
// HTTP method handlers (GET, POST, etc.). Removed invalid default export.
