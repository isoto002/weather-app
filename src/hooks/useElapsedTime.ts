import { useState, useEffect } from 'react'

export function useElapsedTime(since: number | null): string {
  const [, setTick] = useState(0)

  useEffect(() => {
    if (since === null) return
    const id = setInterval(() => setTick((t) => t + 1), 30_000)
    return () => clearInterval(id)
  }, [since])

  if (since === null) return ''

  const seconds = Math.floor((Date.now() - since) / 1000)
  if (seconds < 60) return 'Updated just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `Updated ${minutes} min ago`
  return `Updated ${Math.floor(minutes / 60)}h ago`
}
