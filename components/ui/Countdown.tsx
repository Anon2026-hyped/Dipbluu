import { useEffect, useState } from 'react'

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState('00:00:00')

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft('00:12:34')
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return <span className="font-mono text-sm text-cyan-300">{timeLeft}</span>
}
