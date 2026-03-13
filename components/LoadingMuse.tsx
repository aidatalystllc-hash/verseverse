'use client'

import { useEffect, useState } from 'react'

const MESSAGES = [
  'Summoning your muse... ✨',
  'Sprinkling word magic... 🌟',
  'Consulting the poetry spirits... 🦋',
  'Weaving moonbeams into stanzas... 🌙',
  'Gathering metaphors from the garden... 🌸',
  'Asking the stars for inspiration... ⭐',
  'Brewing the perfect rhyme potion... 🧪',
  'Channeling your inner poet... 🖊️',
]

export default function LoadingMuse() {
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="flex flex-col items-center justify-center gap-6 py-16"
      role="status"
      aria-live="polite"
      aria-label="Generating poem"
    >
      {/* Spinning sparkle */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl" style={{ animation: 'spin 2s linear infinite' }}>
            ✨
          </span>
        </div>
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-400 border-r-pink-400"
          style={{ animation: 'spin 1.5s linear infinite' }}
        />
        <div
          className="absolute inset-2 rounded-full border-4 border-transparent border-b-blue-400 border-l-green-400"
          style={{ animation: 'spin 2s linear infinite reverse' }}
        />
      </div>

      {/* Bouncing dots */}
      <div className="flex items-center gap-1">
        <span className="bounce-dot" />
        <span className="bounce-dot" />
        <span className="bounce-dot" />
      </div>

      {/* Rotating message */}
      <p className="text-plum dark:text-purple-200 font-body text-base font-semibold text-center transition-all duration-500">
        {MESSAGES[msgIndex]}
      </p>
    </div>
  )
}
