'use client'

import { useState, useCallback, ReactNode } from 'react'

interface SparkleButtonProps {
  onClick?: () => void
  children: ReactNode
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'ghost'
  'aria-label'?: string
}

interface Particle {
  id: number
  tx: string
  ty: string
  emoji: string
}

const SPARKLE_EMOJIS = ['✦', '✧', '⋆', '★', '✨', '·']

export default function SparkleButton({
  onClick,
  children,
  className = '',
  disabled = false,
  type = 'button',
  variant = 'primary',
  'aria-label': ariaLabel,
}: SparkleButtonProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [nextId, setNextId] = useState(0)

  const handleClick = useCallback(() => {
    if (disabled) return

    // Spawn 8 sparkle particles
    const newParticles: Particle[] = Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * 360
      const rad = (angle * Math.PI) / 180
      const distance = 30 + Math.random() * 25
      return {
        id: nextId + i,
        tx: `${Math.cos(rad) * distance}px`,
        ty: `${Math.sin(rad) * distance}px`,
        emoji: SPARKLE_EMOJIS[Math.floor(Math.random() * SPARKLE_EMOJIS.length)],
      }
    })

    setNextId((n) => n + 8)
    setParticles((prev) => [...prev, ...newParticles])

    // Remove after animation
    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.find((np) => np.id === p.id))
      )
    }, 700)

    onClick?.()
  }, [disabled, nextId, onClick])

  const baseStyles = 'relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-base transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sparkle focus-visible:ring-offset-2 active:scale-95 select-none overflow-visible'

  const variantStyles = {
    primary: 'bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white shadow-lg hover:shadow-xl hover:scale-105 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
    secondary: 'bg-white text-plum border-2 border-lavender shadow hover:shadow-md hover:border-purple-300 hover:bg-lavender-light disabled:opacity-50 disabled:cursor-not-allowed',
    ghost: 'text-plum hover:bg-lavender-light disabled:opacity-50',
  }

  return (
    <div className="sparkle-container inline-flex">
      <button
        type={type}
        onClick={handleClick}
        disabled={disabled}
        aria-label={ariaLabel}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      >
        {children}
      </button>

      {/* Sparkle particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="sparkle-particle text-pink-400 font-bold pointer-events-none z-50"
          style={
            {
              '--tx': p.tx,
              '--ty': p.ty,
            } as React.CSSProperties
          }
          aria-hidden="true"
        >
          {p.emoji}
        </span>
      ))}
    </div>
  )
}
