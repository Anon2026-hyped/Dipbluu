export function QuoteBlock() {
  return (
    <section className="border-b border-border-default py-20 px-6 sm:px-12">
      <div className="max-w-3xl mx-auto text-center">
        {/* Quote mark */}
        <div
          className="font-garamond text-blue-primary/20 mb-6"
          style={{
            fontSize: '80px',
            lineHeight: '0.6',
          }}
        >
          &quot;
        </div>

        {/* Quote */}
        <p
          className="font-garamond italic text-off-white mb-8"
          style={{
            fontSize: 'clamp(20px, 3vw, 34px)',
            lineHeight: '1.7',
          }}
        >
          Art is not decoration. It is documentation. These works are records of a spiritual
          reality that outlasts their medium.
        </p>

        {/* Attribution */}
        <p
          className="font-barlow text-muted"
          style={{
            fontSize: '10px',
            letterSpacing: '0.3em',
          }}
        >
          DIPBLU · STUDIO DISPATCH, 2025
        </p>
      </div>
    </section>
  )
}
