'use client'

import { useState } from 'react'
import SparkleButton from './SparkleButton'

interface TweakPanelProps {
  onRegenerate: (feedback: string) => void
  isLoading: boolean
  attemptsLeft: number
}

const SUGGESTIONS = [
  'Make it funnier 😄',
  'Make the ending more hopeful',
  'Add a stanza about nature',
  'Make it shorter and punchier',
  'Add more emotion',
  'Make it rhyme more',
]

export default function TweakPanel({ onRegenerate, isLoading, attemptsLeft }: TweakPanelProps) {
  const [feedback, setFeedback] = useState('')

  const handleSubmit = () => {
    if (!feedback.trim()) return
    onRegenerate(feedback)
    setFeedback('')
  }

  const handleSuggestion = (s: string) => {
    setFeedback(s)
  }

  return (
    <div className="glass-card rounded-2xl p-6 max-w-2xl mx-auto mt-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">✏️</span>
        <h3 className="font-heading text-xl text-plum dark:text-purple-200" style={{ fontFamily: 'Pacifico, cursive' }}>
          Tweak Your Poem
        </h3>
        {attemptsLeft > 0 && (
          <span className="ml-auto text-xs text-gray-400 dark:text-purple-400 bg-lavender-light dark:bg-darkCard rounded-full px-2 py-1">
            {attemptsLeft} tweak{attemptsLeft !== 1 ? 's' : ''} left
          </span>
        )}
      </div>

      {attemptsLeft <= 0 ? (
        <div className="text-center py-4">
          <div className="text-3xl mb-2">🌟</div>
          <p className="text-plum dark:text-purple-200 font-body text-sm">
            You&apos;ve done 5 rounds of tweaking — that&apos;s impressive dedication!
            Time to pick your favorite version and make it yours. 💖
          </p>
        </div>
      ) : (
        <>
          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-2 mb-4">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                className="text-xs px-3 py-1.5 rounded-full bg-blush-light dark:bg-darkCard text-plum dark:text-purple-200 border border-blush dark:border-darkBorder hover:bg-pink-100 dark:hover:bg-purple-900 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
              >
                {s}
              </button>
            ))}
          </div>

          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="What would you like to change? (e.g., 'Make it funnier', 'Add a stanza about butterflies', 'Change the ending to be more hopeful')"
            className="w-full p-4 rounded-xl border-2 border-lavender dark:border-darkBorder bg-white dark:bg-darkCard text-plum dark:text-purple-100 font-body text-sm placeholder-gray-300 dark:placeholder-purple-600 focus:outline-none focus:border-purple-400 dark:focus:border-purple-500 resize-none transition-colors"
            rows={3}
            aria-label="Feedback for poem revision"
          />

          <div className="mt-3 flex justify-end">
            <SparkleButton
              onClick={handleSubmit}
              disabled={isLoading || !feedback.trim()}
              variant="primary"
              className="text-sm"
              aria-label="Regenerate poem with feedback"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="bounce-dot" />
                  <span className="bounce-dot" />
                  <span className="bounce-dot" />
                  Rewriting...
                </span>
              ) : (
                '✨ Regenerate'
              )}
            </SparkleButton>
          </div>
        </>
      )}
    </div>
  )
}
