'use client'

export interface PoemVersion {
  id: number
  title: string
  poem: string
  label: string
  timestamp: Date
}

interface VersionHistoryProps {
  versions: PoemVersion[]
  currentId: number
  onSelect: (version: PoemVersion) => void
}

export default function VersionHistory({ versions, currentId, onSelect }: VersionHistoryProps) {
  if (versions.length <= 1) return null

  return (
    <div className="glass-card rounded-2xl p-5 max-w-2xl mx-auto mt-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📜</span>
        <h3 className="font-semibold text-plum dark:text-purple-200 text-sm font-body">
          Version History
        </h3>
        <span className="text-xs text-gray-400 dark:text-purple-500 ml-1">
          ({versions.length} version{versions.length !== 1 ? 's' : ''})
        </span>
      </div>

      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
        {[...versions].reverse().map((v) => (
          <button
            key={v.id}
            onClick={() => onSelect(v)}
            aria-pressed={v.id === currentId}
            className={`text-left px-4 py-3 rounded-xl text-sm font-body transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
              v.id === currentId
                ? 'bg-gradient-to-r from-pink-100 to-purple-100 dark:from-purple-900 dark:to-indigo-900 border-2 border-purple-300 dark:border-purple-600 text-plum dark:text-purple-100'
                : 'bg-white dark:bg-darkCard border border-lavender dark:border-darkBorder text-gray-500 dark:text-purple-400 hover:border-purple-300 hover:bg-lavender-light dark:hover:bg-darkBorder'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold truncate">
                {v.id === currentId && '→ '}
                {v.label}
              </span>
              <span className="text-xs text-gray-300 dark:text-purple-600 shrink-0">
                {v.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-xs mt-1 truncate opacity-60">{v.poem.split('\n')[0]}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
