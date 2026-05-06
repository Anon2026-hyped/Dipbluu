export async function initializePayment(amount: number, email: string) {
  return { status: 'pending', amount, email }
}

export async function verifyPayment(reference: string) {
  return { status: 'success', reference }
}
