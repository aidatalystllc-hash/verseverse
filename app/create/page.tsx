'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import SparkleButton from '@/components/SparkleButton'
import ThemeToggle from '@/components/ThemeToggle'
import LoadingMuse from '@/components/LoadingMuse'

// ── TYPES & CONSTANTS ──────────────────────────────────────────

type Tone = 'Joyful' | 'Melancholic' | 'Romantic' | 'Silly' | 'Mysterious' | 'Empowering'
type Length = 'short' | 'medium' | 'long'
type BeatStyle = 'Free Verse' | 'Haiku' | 'Iambic Pentameter' | 'Ballad' | 'Limerick' | 'Spoken Word'
type RhymeScheme = 'No Rhyme' | 'AABB' | 'ABAB' | 'ABCB' | 'Internal Rhymes' | "Your Choice"

const TONES: { value: Tone; emoji: string }[] = [
  { value: 'Joyful', emoji: '🌟' },
  { value: 'Melancholic', emoji: '🌧️' },
  { value: 'Romantic', emoji: '🌹' },
  { value: 'Silly', emoji: '🐸' },
  { value: 'Mysterious', emoji: '🌙' },
  { value: 'Empowering', emoji: '🔥' },
]

const LENGTHS: { value: Length; label: string; desc: string }[] = [
  { value: 'short', label: 'Short', desc: '4–8 lines' },
  { value: 'medium', label: 'Medium', desc: '12–16 lines' },
  { value: 'long', label: 'Long', desc: '20–28 lines' },
]

const BEAT_STYLES: BeatStyle[] = [
  'Free Verse',
  'Haiku',
  'Iambic Pentameter',
  'Ballad',
  'Limerick',
  'Spoken Word',
]

const RHYME_SCHEMES: { value: RhymeScheme; desc: string }[] = [
  { value: 'No Rhyme', desc: 'No rhyming' },
  { value: 'AABB', desc: 'Couplets' },
  { value: 'ABAB', desc: 'Alternating' },
  { value: 'ABCB', desc: 'Ballad' },
  { value: 'Internal Rhymes', desc: 'Within lines' },
  { value: 'Your Choice', desc: 'Surprise me' },
]

// Random combos for "Surprise Me!"
const RANDOM_THEMES = [
  'a lighthouse keeper who fell in love with a mermaid',
  'the last bookstore on a flooded planet',
  'my cat\'s secret thoughts at 3am',
  'dancing in the rain during an exam week',
  'a fox who learned to play guitar',
  'the smell of petrichor after heartbreak',
  'a letter never sent to a childhood friend',
  'growing tomatoes on the moon',
]

// Inspiration cards
const INSPIRATION_CARDS = [
  {
    emoji: '🌊',
    style: 'Haiku · Melancholic',
    title: 'Ocean Night',
    preview: 'Salt against the dark—\nthe tide knows every secret\nthe shore won\'t admit.',
  },
  {
    emoji: '🐕',
    style: 'Free Verse · Joyful',
    title: 'Ode to Biscuit',
    preview: 'You greet every morning\nlike it invented joy,\nsunlight in a fur coat.',
  },
  {
    emoji: '🌙',
    style: 'Ballad · Mysterious',
    title: 'The Moon\'s Keeper',
    preview: 'She winds the moon each evening,\na silver key in her palm,\nand sighs at all the lovers\nwho borrow her borrowed calm.',
  },
]

// ── COMPONENT ──────────────────────────────────────────────────

export default function CreatePage() {
  const router = useRouter()
  const [userName, setUserName] = useState('Poet')
  const [theme, setTheme] = useState('')
  const [tone, setTone] = useState<Tone>('Joyful')
  const [length, setLength] = useState<Length>('medium')
  const [beatStyle, setBeatStyle] = useState<BeatStyle>('Free Verse')
  const [rhymeScheme, setRhymeScheme] = useState<RhymeScheme>('Your Choice')
  const [specialRequests, setSpecialRequests] = useState('')
  const [whimsical, setWhimsical] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const stored = sessionStorage.getItem('verseverse-username')
    if (!stored) {
      router.replace('/')
      return
    }
    setUserName(stored)
  }, [router])

  const handleSurpriseMe = () => {
    const randomTheme = RANDOM_THEMES[Math.floor(Math.random() * RANDOM_THEMES.length)]
    const randomTone = TONES[Math.floor(Math.random() * TONES.length)].value
    const randomLength = LENGTHS[Math.floor(Math.random() * LENGTHS.length)].value
    const randomBeat = BEAT_STYLES[Math.floor(Math.random() * BEAT_STYLES.length)]
    const randomRhyme = RHYME_SCHEMES[Math.floor(Math.random() * RHYME_SCHEMES.length)].value

    setTheme(randomTheme)
    setTone(randomTone)
    setLength(randomLength)
    setBeatStyle(randomBeat)
    setRhymeScheme(randomRhyme)
    setWhimsical(Math.random() > 0.5)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!theme.trim()) {
      setError('Give your poem a theme first! 🌸')
      return
    }
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/generate-poem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme,
          tone,
          length,
          beatStyle,
          rhymeScheme,
          specialRequests,
          whimsical,
          userName,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'API error')
      }

      const data = await res.json()

      // Store poem data + inputs for /poem page
      sessionStorage.setItem('verseverse-poem', JSON.stringify({
        title: data.title,
        poem: data.poem,
        inputs: { theme, tone, length, beatStyle, rhymeScheme, specialRequests, whimsical, userName },
      }))

      router.push('/poem')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again!')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="gradient-page min-h-screen flex items-center justify-center px-4">
        <div className="glass-card rounded-3xl p-10 max-w-md w-full text-center">
          <LoadingMuse />
        </div>
      </div>
    )
  }

  return (
    <div className="gradient-page min-h-screen px-4 py-12">
      <ThemeToggle />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 fade-up">
          <h1
            className="rainbow-shimmer text-4xl md:text-5xl font-bold mb-2"
            style={{ fontFamily: 'Pacifico, cursive' }}
          >
            VerseVerse ✨
          </h1>
          <p className="text-plum dark:text-purple-300 font-body text-lg">
            Hello, <span className="font-bold text-purple-500">{userName}</span>! Let&apos;s craft your poem.
          </p>
        </div>

        {/* Inspiration cards */}
        <div className="mb-8 fade-up delay-100">
          <p className="text-sm font-semibold text-gray-400 dark:text-purple-500 uppercase tracking-wider mb-3 font-body">
            ✦ Inspiration cards
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {INSPIRATION_CARDS.map((card) => (
              <div
                key={card.title}
                className="glass-card rounded-2xl p-4 cursor-pointer hover:scale-105 transition-transform duration-200 hover:border-purple-300"
                onClick={() => setTheme(card.title.toLowerCase())}
                role="button"
                tabIndex={0}
                aria-label={`Use theme: ${card.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setTheme(card.title.toLowerCase())
                }}
              >
                <div className="text-2xl mb-1">{card.emoji}</div>
                <p className="text-xs text-purple-400 font-body mb-1">{card.style}</p>
                <p className="text-xs font-bold text-plum dark:text-purple-200 mb-2">{card.title}</p>
                <p className="text-xs text-gray-400 dark:text-purple-400 font-body whitespace-pre-line italic leading-relaxed">
                  {card.preview}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Main form */}
        <form onSubmit={handleSubmit} noValidate>

          {/* Surprise Me */}
          <div className="flex justify-end mb-4 fade-up delay-100">
            <SparkleButton
              type="button"
              onClick={handleSurpriseMe}
              variant="secondary"
              className="text-sm"
              aria-label="Auto-fill with random fun combinations"
            >
              🎲 Surprise Me!
            </SparkleButton>
          </div>

          {/* ① Theme */}
          <div className="glass-card rounded-2xl p-6 mb-4 fade-up delay-200">
            <label htmlFor="theme" className="block text-plum dark:text-purple-200 font-body font-bold text-base mb-2">
              ✦ Theme <span className="text-pink-400">*</span>
            </label>
            <p className="text-xs text-gray-400 dark:text-purple-500 mb-3 font-body">
              What is the poem about? Be specific for best results.
            </p>
            <input
              id="theme"
              type="text"
              value={theme}
              onChange={(e) => {
                setTheme(e.target.value)
                if (error) setError('')
              }}
              placeholder="e.g., the ocean at night, my dog named Biscuit, my grandmother's hands..."
              className="w-full px-4 py-3 rounded-xl border-2 border-lavender dark:border-darkBorder bg-white dark:bg-darkCard text-plum dark:text-purple-100 font-body text-sm placeholder-gray-300 dark:placeholder-purple-600 focus:outline-none focus:border-purple-400 dark:focus:border-purple-500 transition-colors"
              aria-required="true"
              aria-invalid={!!error}
              maxLength={200}
            />
            {error && (
              <p className="text-pink-500 text-xs mt-2 font-body" role="alert">
                {error}
              </p>
            )}
          </div>

          {/* ② Tone */}
          <div className="glass-card rounded-2xl p-6 mb-4 fade-up delay-300">
            <p className="text-plum dark:text-purple-200 font-body font-bold text-base mb-2">
              ✦ Tone
            </p>
            <div className="grid grid-cols-3 gap-2">
              {TONES.map(({ value, emoji }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTone(value)}
                  aria-pressed={tone === value}
                  className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-sm font-body font-semibold border-2 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                    tone === value
                      ? 'border-purple-400 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 text-purple-700 dark:text-purple-200 shadow-md'
                      : 'border-lavender dark:border-darkBorder bg-white dark:bg-darkCard text-plum dark:text-purple-300 hover:border-purple-300'
                  }`}
                >
                  <span className="text-xl">{emoji}</span>
                  <span className="text-xs">{value}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ③ Length */}
          <div className="glass-card rounded-2xl p-6 mb-4 fade-up delay-300">
            <p className="text-plum dark:text-purple-200 font-body font-bold text-base mb-2">
              ✦ Length
            </p>
            <div className="grid grid-cols-3 gap-3">
              {LENGTHS.map(({ value, label, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setLength(value)}
                  aria-pressed={length === value}
                  className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-sm font-body border-2 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                    length === value
                      ? 'border-blue-400 bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-900 dark:to-sky-900 text-blue-700 dark:text-blue-200 font-bold shadow-md'
                      : 'border-sky-light dark:border-darkBorder bg-white dark:bg-darkCard text-plum dark:text-purple-300 hover:border-blue-300'
                  }`}
                >
                  <span className="font-bold">{label}</span>
                  <span className="text-xs opacity-70">{desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ④ Beat/Rhythm Style */}
          <div className="glass-card rounded-2xl p-6 mb-4 fade-up delay-400">
            <label htmlFor="beat-style" className="block text-plum dark:text-purple-200 font-body font-bold text-base mb-2">
              ✦ Rhythm Style
            </label>
            <select
              id="beat-style"
              value={beatStyle}
              onChange={(e) => setBeatStyle(e.target.value as BeatStyle)}
              className="w-full px-4 py-3 rounded-xl border-2 border-lavender dark:border-darkBorder bg-white dark:bg-darkCard text-plum dark:text-purple-100 font-body text-sm focus:outline-none focus:border-purple-400 dark:focus:border-purple-500 transition-colors appearance-none cursor-pointer"
            >
              {BEAT_STYLES.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>

          {/* ⑤ Rhyme Scheme */}
          <div className="glass-card rounded-2xl p-6 mb-4 fade-up delay-400">
            <p className="text-plum dark:text-purple-200 font-body font-bold text-base mb-2">
              ✦ Rhyme Scheme
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {RHYME_SCHEMES.map(({ value, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRhymeScheme(value)}
                  aria-pressed={rhymeScheme === value}
                  className={`flex flex-col items-start gap-0.5 py-2.5 px-3 rounded-xl text-sm font-body border-2 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                    rhymeScheme === value
                      ? 'border-pink-400 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900 dark:to-rose-900 text-pink-700 dark:text-pink-200 font-bold shadow-md'
                      : 'border-blush dark:border-darkBorder bg-white dark:bg-darkCard text-plum dark:text-purple-300 hover:border-pink-300'
                  }`}
                >
                  <span className="font-semibold">{value}</span>
                  <span className="text-xs opacity-60">{desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ⑥ Special Requests */}
          <div className="glass-card rounded-2xl p-6 mb-4 fade-up delay-500">
            <label htmlFor="special-requests" className="block text-plum dark:text-purple-200 font-body font-bold text-base mb-1">
              ✦ Special Requests <span className="text-gray-300 dark:text-purple-600 font-normal text-sm">(optional)</span>
            </label>
            <p className="text-xs text-gray-400 dark:text-purple-500 mb-3 font-body">
              Dedications, hidden words, specific imagery, references...
            </p>
            <textarea
              id="special-requests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="e.g., 'Dedicate it to my friend Emma', 'Include the word serendipity', 'Make it reference the Milky Way'"
              className="w-full px-4 py-3 rounded-xl border-2 border-mint dark:border-darkBorder bg-white dark:bg-darkCard text-plum dark:text-purple-100 font-body text-sm placeholder-gray-300 dark:placeholder-purple-600 focus:outline-none focus:border-green-400 dark:focus:border-green-600 transition-colors resize-none"
              rows={3}
              maxLength={500}
            />
          </div>

          {/* ⑦ Mood Booster */}
          <div className="glass-card rounded-2xl p-6 mb-8 fade-up delay-500">
            <label className="flex items-center gap-4 cursor-pointer group" htmlFor="whimsical">
              <div className="relative">
                <input
                  id="whimsical"
                  type="checkbox"
                  checked={whimsical}
                  onChange={(e) => setWhimsical(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                    whimsical ? 'bg-gradient-to-r from-pink-400 to-purple-400' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  aria-hidden="true"
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-0.5 ml-0.5 ${
                      whimsical ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
              <div>
                <p className="text-plum dark:text-purple-200 font-body font-bold text-base">
                  Make it extra whimsical 🦄
                </p>
                <p className="text-xs text-gray-400 dark:text-purple-500 font-body">
                  Adds unexpected magical imagery and metaphors
                </p>
              </div>
            </label>
          </div>

          {/* Submit */}
          <div className="text-center fade-up delay-600">
            <SparkleButton
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="text-lg px-12 py-4 rounded-2xl"
              aria-label="Generate my poem"
            >
              ✨ Generate My Poem ✨
            </SparkleButton>
            <p className="mt-3 text-xs text-gray-300 dark:text-purple-600 font-body">
              Claude AI will craft something just for you 🌈
            </p>
          </div>
        </form>

        {/* Back link */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-gray-400 hover:text-purple-500 transition-colors font-body focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
          >
            ← Back to welcome
          </button>
        </div>
      </div>
    </div>
  )
}
