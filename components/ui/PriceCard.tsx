interface PriceCardProps {
  title: string
  price: string
}

export function PriceCard({ title, price }: PriceCardProps) {
  return (
    <div className="rounded-3xl bg-slate-900/80 p-6">
      <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">{title}</p>
      <p className="mt-4 text-3xl font-semibold">{price}</p>
    </div>
  )
}
