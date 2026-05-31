const PACKAGE_OPTIONS = [
  { tier: 'ONE PRINT', price: '₦33,333', usd: '≈ $22 USD', id: 'one' },
  {
    tier: 'TWO PRINTS · MOST POPULAR',
    price: '₦66,666',
    usd: '≈ $44 USD',
    id: 'two',
    featured: true,
  },
  { tier: 'THREE PRINTS · FULL SET', price: '₦99,999', usd: '≈ $66 USD', id: 'three' },
]

export function Acquire() {
  return (
    <section id="acquire" className="px-6 py-20 sm:px-12 sm:py-28">
      <div className="mb-12 text-center sm:mb-16">
        <p
          className="mb-4 font-barlow text-blue-bright"
          style={{ fontSize: '10px', letterSpacing: '0.4em' }}
        >
          ACQUIRE
        </p>
        <h2
          className="font-bebas text-white"
          style={{ fontSize: 'clamp(40px, 7vw, 84px)', letterSpacing: '0.02em' }}
        >
          OWN A PIECE
        </h2>
        <p className="mx-auto mt-3 max-w-md font-garamond text-muted-2 italic">
          Each print belongs to the blind drop. Pick your pieces from the collection.
        </p>
      </div>

      {/* Price tiers */}
      <div className="mx-auto mb-12 grid max-w-4xl grid-cols-1 border border-border-default md:grid-cols-3">
        {PACKAGE_OPTIONS.map((option) => (
          <div
            key={option.id}
            className={`flex flex-col border-border-default p-8 md:border-r md:last:border-r-0 ${
              option.featured
                ? 'bg-blue-bright/[0.06] md:-translate-y-4 md:border-t-2 md:border-t-blue-primary'
                : ''
            }`}
          >
            <div
              className="mb-4 font-barlow text-muted"
              style={{ fontSize: '9.5px', letterSpacing: '0.32em' }}
            >
              {option.tier}
            </div>
            <div
              className={`mb-2 font-bebas ${option.featured ? 'text-blue-bright' : 'text-white'}`}
              style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.04em' }}
            >
              {option.price}
            </div>
            <div
              className="mb-6 font-barlow text-muted"
              style={{ fontSize: '10.5px', letterSpacing: '0.16em' }}
            >
              {option.usd}
            </div>
            <a
              href="#works"
              className={`mt-auto block border px-4 py-3 text-center font-barlow transition-all ${
                option.featured
                  ? 'border-blue-bright text-blue-bright hover:bg-blue-primary hover:text-black'
                  : 'border-white/35 text-white hover:border-blue-bright hover:text-blue-bright'
              }`}
              style={{ fontSize: '10.5px', letterSpacing: '0.28em' }}
            >
              SELECT A PIECE →
            </a>
          </div>
        ))}
      </div>

      {/* Original triptych */}
      <div
        className="mx-auto flex max-w-4xl flex-col gap-6 border border-border-gold p-7 md:flex-row md:items-center"
        style={{ background: 'rgba(201, 168, 76, 0.12)' }}
      >
        <div className="flex-1">
          <div
            className="mb-2 font-barlow text-gold/70"
            style={{ fontSize: '10px', letterSpacing: '0.28em' }}
          >
            THE ORIGINAL TRIPTYCH
          </div>
          <div
            className="font-bebas text-gold line-through"
            style={{ fontSize: 'clamp(24px, 3vw, 32px)', letterSpacing: '0.06em', opacity: 0.4 }}
          >
            ₦10,207,600.00
          </div>
        </div>
        <div className="flex-1">
          <div className="font-barlow text-muted text-xs" style={{ letterSpacing: '0.22em' }}>
            ACQUIRED · PRIVATE COLLECTION
          </div>
        </div>
        <div>
          <span
            className="inline-block border border-muted px-6 py-2 font-barlow text-muted text-xs opacity-40"
            style={{ letterSpacing: '0.28em' }}
          >
            SOLD
          </span>
        </div>
      </div>
    </section>
  )
}
