'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PoemCard from '@/components/PoemCard'
import TweakPanel from '@/components/TweakPanel'
import VersionHistory, { PoemVersion } from '@/components/VersionHistory'
import ThemeToggle from '@/components/ThemeToggle'
import LoadingMuse from '@/components/LoadingMuse'

const MAX_TWEAKS = 5

interface PoemData {
  title: string
  poem: string
  inputs: {
    theme: string
    tone: string
    length: string
    beatStyle: string
    rhymeScheme: string
    specialRequests: string
    whimsical: boolean
    userName: string
  }
}

export default function PoemPage() {
  const router = useRouter()
  const [poemData, setPoemData] = useState<PoemData | null>(null)
  const [currentTitle, setCurrentTitle] = useState('')
  const [currentPoem, setCurrentPoem] = useState('')
  const [userName, setUserName] = useState('Poet')
  const [showTweak, setShowTweak] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [tweakCount, setTweakCount] = useState(0)
  const [versions, setVersions] = useState<PoemVersion[]>([])
  const [currentVersionId, setCurrentVersionId] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    const raw = sessionStorage.getItem('verseverse-poem')
    const name = sessionStorage.getItem('verseverse-username')

    if (!raw || !name) {
      router.replace('/')
      return
    }

    try {
      const data = JSON.parse(raw) as PoemData
      setPoemData(data)
      setCurrentTitle(data.title)
      setCurrentPoem(data.poem)
      setUserName(name)

      const initialVersion: PoemVersion = {
        id: 0,
        title: data.title,
        poem: data.poem,
        label: 'Original',
        timestamp: new Date(),
      }
      setVersions([initialVersion])
      setCurrentVersionId(0)
    } catch {
      router.replace('/')
    }
  }, [router])

  const handleLoveIt = async () => {
    // Trigger PDF download
    const { generatePoemPDF } = await import('@/lib/generatePDF')
    await generatePoemPDF({
      title: currentTitle,
      poem: currentPoem,
      userName,
    })
  }

  const handleRegenerate = async (feedback: string) => {
    if (!poemData) return
    setIsRegenerating(true)
    setError('')

    try {
      const res = await fetch('/api/regenerate-poem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalPoem: currentPoem,
          originalTitle: currentTitle,
          feedbackRequest: feedback,
          originalInputs: poemData.inputs,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'API error')
      }

      const data = await res.json()
      const newTweakCount = tweakCount + 1
      const newVersionId = versions.length

      const newVersion: PoemVersion = {
        id: newVersionId,
        title: data.title,
        poem: data.poem,
        label: `Revision ${newTweakCount} — "${feedback.slice(0, 30)}${feedback.length > 30 ? '…' : ''}"`,
        timestamp: new Date(),
      }

      setCurrentTitle(data.title)
      setCurrentPoem(data.poem)
      setTweakCount(newTweakCount)
      setVersions((prev) => [...prev, newVersion])
      setCurrentVersionId(newVersionId)
      setShowTweak(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again!')
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleSelectVersion = (version: PoemVersion) => {
    setCurrentTitle(version.title)
    setCurrentPoem(version.poem)
    setCurrentVersionId(version.id)
  }

  // Loading state while data loads from sessionStorage
  if (!poemData) {
    return (
      <div className="gradient-page min-h-screen flex items-center justify-center px-4">
        <div className="glass-card rounded-3xl p-10 max-w-md w-full text-center">
          <LoadingMuse />
        </div>
      </div>
    )
  }

  if (isRegenerating) {
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
        <div className="text-center mb-8 fade-up">
          <h1
            className="rainbow-shimmer text-3xl md:text-4xl font-bold mb-1"
            style={{ fontFamily: 'Pacifico, cursive' }}
          >
            VerseVerse ✨
          </h1>
          <p className="text-plum dark:text-purple-300 font-body text-sm">
            Your poem is ready, <span className="font-bold">{userName}</span>! 🌟
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div
            className="glass-card rounded-2xl p-4 mb-4 border-2 border-pink-300 text-center fade-up"
            role="alert"
          >
            <p className="text-pink-600 dark:text-pink-400 font-body text-sm mb-2">
              😔 Oh no! {error}
            </p>
            <button
              onClick={() => setError('')}
              className="text-xs text-gray-400 underline hover:text-pink-500 font-body focus:outline-none"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Poem card */}
        <div className="fade-up delay-100">
          <PoemCard
            title={currentTitle}
            poem={currentPoem}
            userName={userName}
            onLoveIt={handleLoveIt}
            onTweak={() => setShowTweak((v) => !v)}
          />
        </div>

        {/* Tweak panel */}
        {showTweak && (
          <div className="fade-up delay-200">
            <TweakPanel
              onRegenerate={handleRegenerate}
              isLoading={isRegenerating}
              attemptsLeft={MAX_TWEAKS - tweakCount}
            />
          </div>
        )}

        {/* Version history */}
        <div className="fade-up delay-300">
          <VersionHistory
            versions={versions}
            currentId={currentVersionId}
            onSelect={handleSelectVersion}
          />
        </div>

        {/* Bottom actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center fade-up delay-400">
          <button
            onClick={() => {
              sessionStorage.removeItem('verseverse-poem')
              router.push('/create')
            }}
            className="text-sm text-gray-400 hover:text-purple-500 transition-colors font-body focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded px-4 py-2"
          >
            ← Write another poem
          </button>
          <button
            onClick={() => router.push('/')}
            className="text-sm text-gray-400 hover:text-purple-500 transition-colors font-body focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded px-4 py-2"
          >
            🏠 Home
          </button>
        </div>

        {/* Animals footer */}
        <div className="text-center mt-6 text-2xl space-x-2 opacity-40" aria-hidden="true">
          🦋 🐱 🐰 🦊 🌸
        </div>
      </div>
    </div>
  )
}
