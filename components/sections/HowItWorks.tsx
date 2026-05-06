'use client'

export function HowItWorks() {
  const STEPS = [
    {
      number: '01',
      title: 'CHOOSE YOUR PRINTS.',
      body: 'One print (₦33,333), two (₦66,666), or three (₦99,999). One order per person.',
    },
    {
      number: '02',
      title: 'SALE WINDOW.',
      body: 'Opens and closes at midnight WAT. See the countdown in the nav above.',
    },
    {
      number: '03',
      title: 'RANDOM ASSIGNMENT.',
      body: 'Your prints are drawn at close. You may receive duplicates — purchasing three does not guarantee the full set.',
    },
    {
      number: '04',
      title: 'LAGOS BASED COLLECTORS.',
      body: 'You will be invited to pick up your work at our partner gallery. Unbox on the spot.',
    },
    {
      number: '05',
      title: 'INTERNATIONAL COLLECTORS.',
      body: 'Works ship within 10 business days of close. Tracking details sent via email.',
    },
  ]

  const STATS = [
    { number: '10', label: 'DAYS TO SHIP', color: 'text-blue-bright' },
    { number: '100%', label: 'HAND SIGNED', color: 'text-gold' },
    { number: '1/111', label: 'NUMBERED', color: 'text-white' },
    { number: 'NGN', label: '+ CRYPTO', color: 'text-blue-bright' },
  ]

  return (
    <section className="bg-panel border-t border-b border-border-default py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 px-6 sm:px-12 max-w-6xl mx-auto">
        {/* Left Column - Steps */}
        <div>
          <div
            className="font-barlow text-muted mb-12"
            style={{ fontSize: '10px', letterSpacing: '0.36em' }}
          >
            HOW IT WORKS
          </div>

          {/* Ghost number background */}
          <div
            className="font-bebas text-blue-primary/8 absolute -ml-20 pointer-events-none"
            style={{
              fontSize: '160px',
              letterSpacing: '0.04em',
            }}
          >
            05
          </div>

          {/* Steps */}
          <div className="border-t border-border-default">
            {STEPS.map((step, idx) => (
              <div
                key={step.number}
                className="border-b border-border-default flex gap-6 px-0 py-6 hover:pl-2 transition-all cursor-default group"
              >
                <span
                  className="font-cinzel text-white/15 text-xs flex-shrink-0 group-hover:text-white/30 transition-colors"
                  style={{ fontSize: '9.5px', letterSpacing: '0.12em', minWidth: '20px' }}
                >
                  {step.number}
                </span>
                <div>
                  <h3
                    className="font-barlow text-white mb-2 group-hover:text-blue-bright transition-colors"
                    style={{ fontSize: '10.5px', letterSpacing: '0.26em' }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="font-garamond italic text-white/65"
                    style={{
                      fontSize: 'clamp(14px, 1.5vw, 16.5px)',
                      lineHeight: '1.72',
                    }}
                  >
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Artist Note & Stats */}
        <div className="flex flex-col gap-8">
          {/* Artist's Note */}
          <div
            className="border border-border-gold bg-gold-dim p-9"
            style={{ background: 'rgba(201, 168, 76, 0.15)' }}
          >
            <div
              className="font-barlow text-gold/70 mb-6"
              style={{ fontSize: '9.5px', letterSpacing: '0.28em' }}
            >
              ARTIST&apos;S NOTE
            </div>
            <p
              className="font-garamond italic text-off-white mb-6"
              style={{
                fontSize: 'clamp(18px, 2vw, 20px)',
                lineHeight: '1.78',
              }}
            >
              The blind draw is not randomness — it is faith. You trust the work to find you.
            </p>
            <p
              className="font-barlow text-gold/50"
              style={{ fontSize: '10px', letterSpacing: '0.2em' }}
            >
              — DIPBLU
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-px border border-border-default bg-panel">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-panel-2 p-6 flex flex-col items-center justify-center text-center"
              >
                <div
                  className={`font-bebas ${stat.color} mb-2`}
                  style={{
                    fontSize: '32px',
                    letterSpacing: '0.08em',
                  }}
                >
                  {stat.number}
                </div>
                <div
                  className="font-barlow text-muted text-xs"
                  style={{
                    fontSize: '9px',
                    letterSpacing: '0.26em',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
