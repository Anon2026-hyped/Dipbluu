export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h1 className="font-bebas text-4xl text-white">FULFILLMENT IS MANUAL</h1>
      <p className="mt-4 font-barlow text-sm leading-7 text-muted">
        Payment notifications are sent to the seller when a customer completes checkout. Orders are
        handled outside the app in the fulfillment workflow, so no admin dashboard is exposed here.
      </p>
    </div>
  )
}
