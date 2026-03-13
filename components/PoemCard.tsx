'use client'

import { useState } from 'react'
import SparkleButton from './SparkleButton'

interface PoemCardProps {
  title: string
  poem: string
  userName: string
  onLoveIt: () => void
  onTweak: () => void
}

export default function PoemCard({ title, poem, userName, onLoveIt, onTweak }: PoemCardProps) {
  const [copied, setCopied] = useState(false)
  const lines = poem.split('\n')

  const handleCopy = async () => {
    const text = `${title}\nA poem by ${userName}\n\n${poem}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="glass-card rounded-3xl p-8 md:p-12 ornamental-border max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">✦</div>
        <h2
          className="font-heading text-3xl md:text-4xl text-plum dark:text-purple-200 mb-2"
          style={{ fontFamily: 'Pacifico, cursive' }}
        >
          {title}
        </h2>
        <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent my-3" />
        <p className="text-sm italic text-gray-400 dark:text-purple-300 font-body">
          A poem by <span className="font-semibold text-purple-500 dark:text-purple-300">{userName}</span>
        </p>
      </div>

      {/* Poem body */}
      <div className="poem-body mb-8 space-y-1">
        {lines.map((line, i) => (
          <p
            key={i}
            className="poem-line text-plum dark:text-purple-100 font-body text-base md:text-lg leading-relaxed text-center"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            {line === '' ? <>&nbsp;</> : line}
          </p>
        ))}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent" />
        <span className="text-pink-300 text-sm">✦ ✦ ✦</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-pink-200 to-transparent" />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <SparkleButton
          onClick={onLoveIt}
          variant="primary"
          className="text-sm px-8"
          aria-label="Download poem as PDF"
        >
          ✅ I love it! Make my PDF →
        </SparkleButton>

        <SparkleButton
          onClick={onTweak}
          variant="secondary"
          className="text-sm px-8"
          aria-label="Tweak the poem"
        >
          ✏️ Tweak it
        </SparkleButton>
      </div>

      {/* Copy button */}
      <div className="mt-4 text-center">
        <button
          onClick={handleCopy}
          className="text-sm text-purple-400 hover:text-pink-500 transition-colors duration-200 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
          aria-label="Copy poem to clipboard"
        >
          {copied ? (
            <span className="text-green-500 font-semibold">✓ Copied to clipboard!</span>
          ) : (
            '📋 Copy poem to clipboard'
          )}
        </button>
      </div>
    </div>
  )
}
