'use client'

interface Animal {
  emoji: string
  x: string
  y: string
  delay: string
  duration: string
  size: string
  opacity: string
}

const animals: Animal[] = [
  { emoji: '🦋', x: '8%',  y: '15%', delay: '0s',    duration: '4s',   size: 'text-3xl', opacity: 'opacity-60' },
  { emoji: '🐱', x: '88%', y: '20%', delay: '0.8s',  duration: '5s',   size: 'text-2xl', opacity: 'opacity-50' },
  { emoji: '🐰', x: '5%',  y: '60%', delay: '1.5s',  duration: '4.5s', size: 'text-3xl', opacity: 'opacity-60' },
  { emoji: '🦊', x: '92%', y: '55%', delay: '0.3s',  duration: '6s',   size: 'text-2xl', opacity: 'opacity-50' },
  { emoji: '🐦', x: '20%', y: '80%', delay: '2s',    duration: '3.5s', size: 'text-2xl', opacity: 'opacity-40' },
  { emoji: '🦄', x: '78%', y: '75%', delay: '1s',    duration: '5.5s', size: 'text-3xl', opacity: 'opacity-50' },
  { emoji: '🌸', x: '45%', y: '8%',  delay: '0.5s',  duration: '4s',   size: 'text-2xl', opacity: 'opacity-50' },
  { emoji: '🐸', x: '60%', y: '85%', delay: '1.8s',  duration: '5s',   size: 'text-xl',  opacity: 'opacity-40' },
  { emoji: '🦋', x: '35%', y: '90%', delay: '0.2s',  duration: '4.5s', size: 'text-xl',  opacity: 'opacity-30' },
  { emoji: '🌸', x: '72%', y: '12%', delay: '1.2s',  duration: '6s',   size: 'text-xl',  opacity: 'opacity-40' },
  { emoji: '🐰', x: '15%', y: '35%', delay: '2.5s',  duration: '5s',   size: 'text-xl',  opacity: 'opacity-30' },
  { emoji: '🦊', x: '55%', y: '3%',  delay: '0.7s',  duration: '4.8s', size: 'text-2xl', opacity: 'opacity-40' },
]

export default function AnimalFloat() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {animals.map((animal, i) => (
        <div
          key={i}
          className={`absolute ${animal.size} ${animal.opacity} select-none`}
          style={{
            left: animal.x,
            top: animal.y,
            animation: `float ${animal.duration} ease-in-out ${animal.delay} infinite`,
          }}
        >
          {animal.emoji}
        </div>
      ))}
    </div>
  )
}
