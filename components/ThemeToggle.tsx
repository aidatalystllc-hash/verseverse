'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('verseverse-theme')
    if (stored === 'dark') {
      setDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('verseverse-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('verseverse-theme', 'light')
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light pastel theme' : 'Switch to dark theme'}
      title={dark ? 'Light mode' : 'Dark mode'}
      className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full glass-card flex items-center justify-center text-lg hover:scale-110 transition-transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 shadow-md"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  )
}
