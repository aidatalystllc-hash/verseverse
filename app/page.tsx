'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import AnimalFloat from '@/components/AnimalFloat'
import SparkleButton from '@/components/SparkleButton'
import ThemeToggle from '@/components/ThemeToggle'

export default function WelcomePage() {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleStart = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Tell us your name first, poet! 🌸')
      return
    }
    // Store name in sessionStorage
    sessionStorage.setItem('verseverse-username', name.trim())
    router.push('/create')
  }

  return (
    <div className="gradient-page relative flex flex-col items-center justify-center min-h-screen px-4 py-16 overflow-hidden">
      <ThemeToggle />
      <AnimalFloat />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-lg text-center fade-up">
        {/* Logo / Title */}
        <div className="mb-4">
          <h1
            className="rainbow-shimmer text-6xl md:text-7xl font-bold leading-tight"
            style={{ fontFamily: 'Pacifico, cursive' }}
            aria-label="VerseVerse"
          >
            VerseVerse
          </h1>
          <span className="text-4xl md:text-5xl block -mt-2" aria-hidden="true">
            ✨
          </span>
        </div>

        <p
          className="text-plum dark:text-purple-200 text-xl md:text-2xl font-body font-semibold mb-2 fade-up delay-200"
        >
          Your magical poem generator
        </p>
        <p className="text-gray-400 dark:text-purple-400 text-sm font-body mb-10 fade-up delay-300">
          Tell Claude how you feel — get a poem that&apos;s just for you 🦋
        </p>

        {/* Name form */}
        <form
          onSubmit={handleStart}
          className="glass-card rounded-3xl p-8 md:p-10 fade-up delay-400"
          noValidate
        >
          <label
            htmlFor="poet-name"
            className="block text-plum dark:text-purple-200 font-body font-bold text-lg mb-3"
          >
            What&apos;s your name, poet? 🌟
          </label>

          <input
            id="poet-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (error) setError('')
            }}
            placeholder="e.g., Sarah, Luna, Alex..."
            maxLength={50}
            autoFocus
            className="w-full px-5 py-3.5 rounded-2xl border-2 border-lavender dark:border-darkBorder bg-white dark:bg-darkCard text-plum dark:text-purple-100 font-body text-base placeholder-gray-300 dark:placeholder-purple-600 focus:outline-none focus:border-purple-400 dark:focus:border-purple-500 transition-colors mb-2"
            aria-describedby={error ? 'name-error' : undefined}
            aria-invalid={!!error}
          />

          {error && (
            <p id="name-error" className="text-pink-500 text-sm mb-3 font-body" role="alert">
              {error}
            </p>
          )}

          <div className="mt-5">
            <SparkleButton
              type="submit"
              variant="primary"
              className="w-full text-lg py-4 rounded-2xl"
              aria-label="Start creating your poem"
            >
              Start Creating →
            </SparkleButton>
          </div>
        </form>

        {/* Tagline footer */}
        <p className="mt-8 text-xs text-gray-300 dark:text-purple-600 font-body fade-up delay-600">
          Powered by Claude AI &nbsp;·&nbsp; No sign-up needed &nbsp;·&nbsp; Pure magic 🌈
        </p>
      </div>

      {/* Decorative pastel blobs */}
      <div
        className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #D8B4FE, transparent)', transform: 'translate(-30%, -30%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #A7F3D0, transparent)', transform: 'translate(30%, 30%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 right-0 w-56 h-56 rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FED7AA, transparent)', transform: 'translate(40%, -50%)' }}
        aria-hidden="true"
      />
    </div>
  )
}
