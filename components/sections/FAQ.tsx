'use client'

import { useState } from 'react'

const FAQ_ITEMS = [
  {
    q: 'WHAT IS THIS DROP?',
    a: 'A blind drop of three new works by BOANERGES — visual artist and founder of A Royal Priesthood. Each piece is available as a limited edition of 111. You will not know which piece you receive until it arrives.',
  },
  {
    q: 'HOW ARE PRINTS ASSIGNED?',
    a: 'After the sale window closes, all orders are randomised and assigned by draw. Each print is numbered and signed by the artist before dispatch.',
  },
  {
    q: 'CAN I CHOOSE A SPECIFIC PIECE?',
    a: 'No. This is a blind drop — the element of chance is central to the experience. You may place one order per person maximum.',
  },
  {
    q: 'WHAT PAYMENT METHODS ARE ACCEPTED?',
    a: 'We accept card payments via Stripe (USD), as well as cryptocurrency payments including Bitcoin, Ethereum, and USDT. Select your preferred method at checkout.',
  },
  {
    q: 'HOW DO I COLLECT MY PIECE?',
    a: 'Local collectors will be invited to a pickup event. International orders ship within 10 business days. All collectors receive email confirmation with tracking or pickup details.',
  },
  {
    q: 'RETURNS?',
    a: 'All sales are final. Given the blind nature of the drop and the limited edition status of the works, we do not accept returns or exchanges.',
  },
]

interface AccordionItemProps {
  q: string
  a: string
  isOpen: boolean
  onToggle: () => void
}

function AccordionItem({ q, a, isOpen, onToggle }: AccordionItemProps) {
  return (
    <div className="border-b border-border-default hover:bg-white/1.5 transition-colors">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 px-0 text-left group"
      >
        <span
          className="font-barlow text-white group-hover:text-blue-bright transition-colors flex-1"
          style={{ fontSize: '11.5px', letterSpacing: '0.22em' }}
        >
          {q}
        </span>
        <span
          className={`text-muted group-hover:text-blue-bright transition-all duration-300 ${
            isOpen ? 'rotate-45' : ''
          }`}
          style={{ fontSize: '18px', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >
          +
        </span>
      </button>

      {/* Answer */}
      <div
        className="overflow-hidden transition-all duration-450 ease-out"
        style={{
          maxHeight: isOpen ? '280px' : '0px',
        }}
      >
        <p
          className="pb-6 font-garamond italic text-white/68 max-w-xl"
          style={{
            fontSize: 'clamp(15px, 1.6vw, 18px)',
            lineHeight: '1.75',
          }}
        >
          {a}
        </p>
      </div>
    </div>
  )
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="questions" className="py-20 px-6 sm:px-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div
          className="text-center font-barlow text-muted mb-4"
          style={{ fontSize: '10px', letterSpacing: '0.32em' }}
        >
          OFT · ASKED
        </div>

        <h2
          className="text-center font-bebas text-white mb-16"
          style={{
            fontSize: 'clamp(44px, 8vw, 88px)',
            letterSpacing: '0.07em',
          }}
        >
          QUESTIONS
        </h2>

        {/* Accordion */}
        <div className="border-t border-border-default">
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem
              key={item.q}
              q={item.q}
              a={item.a}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
