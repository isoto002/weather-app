import { useRef, useEffect, useState, useCallback } from 'react'

interface UsePullToRefreshOptions {
  onRefresh: () => void
  threshold?: number
}

export function usePullToRefresh({ onRefresh, threshold = 80 }: UsePullToRefreshOptions) {
  const [pulling, setPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef(0)
  const isPulling = useRef(false)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY
      isPulling.current = true
    }
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling.current) return

    const currentY = e.touches[0].clientY
    const distance = currentY - startY.current

    if (distance > 0 && window.scrollY === 0) {
      setPulling(true)
      setPullDistance(Math.min(distance * 0.4, threshold * 1.5))
    }
  }, [threshold])

  const handleTouchEnd = useCallback(() => {
    if (pullDistance >= threshold) {
      onRefresh()
    }
    isPulling.current = false
    setPulling(false)
    setPullDistance(0)
  }, [pullDistance, threshold, onRefresh])

  useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  return { pulling, pullDistance }
}
