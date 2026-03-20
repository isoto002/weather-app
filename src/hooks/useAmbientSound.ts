import { useRef, useEffect, useCallback } from 'react'
import type { WeatherCondition } from '../types/weather'

const SOUND_MAP: Record<string, string> = {
  'clear-day': '/sounds/clear-day.mp3',
  'clear-night': '/sounds/clear-night.mp3',
  'rain': '/sounds/rain.mp3',
  'thunderstorm': '/sounds/thunder.mp3',
  'snow': '/sounds/snow.mp3',
  'cloudy': '/sounds/cloudy.mp3',
  'partly-cloudy': '/sounds/cloudy.mp3',
  'fog': '/sounds/fog.mp3',
}

function getSoundKey(condition: WeatherCondition, isNight: boolean): string {
  if (condition === 'clear') return isNight ? 'clear-night' : 'clear-day'
  return condition
}

export function useAmbientSound(
  condition: WeatherCondition | null,
  isNight: boolean,
  muted: boolean
) {
  const currentAudio = useRef<HTMLAudioElement | null>(null)
  const fadingAudio = useRef<HTMLAudioElement | null>(null)
  const fadeInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const loadedRef = useRef(false)

  const stopFade = useCallback(() => {
    if (fadeInterval.current) {
      clearInterval(fadeInterval.current)
      fadeInterval.current = null
    }
  }, [])

  const fadeIn = useCallback((audio: HTMLAudioElement, targetVolume: number, duration: number) => {
    audio.volume = 0
    audio.play().catch(() => {})
    const steps = 30
    const stepTime = duration / steps
    const volumeStep = targetVolume / steps
    let current = 0

    const id = setInterval(() => {
      current += volumeStep
      if (current >= targetVolume) {
        audio.volume = targetVolume
        clearInterval(id)
      } else {
        audio.volume = current
      }
    }, stepTime)

    return id
  }, [])

  const fadeOut = useCallback((audio: HTMLAudioElement, duration: number) => {
    const startVol = audio.volume
    const steps = 20
    const stepTime = duration / steps
    const volumeStep = startVol / steps

    fadeInterval.current = setInterval(() => {
      const newVol = audio.volume - volumeStep
      if (newVol <= 0) {
        audio.volume = 0
        audio.pause()
        stopFade()
      } else {
        audio.volume = newVol
      }
    }, stepTime)
  }, [stopFade])

  useEffect(() => {
    if (muted || !condition) {
      if (currentAudio.current && !currentAudio.current.paused) {
        fadeOut(currentAudio.current, 500)
      }
      return
    }

    const soundKey = getSoundKey(condition, isNight)
    const soundUrl = SOUND_MAP[soundKey]
    if (!soundUrl) return

    const currentSrc = currentAudio.current?.src ?? ''

    if (currentAudio.current && !currentAudio.current.paused && currentSrc.endsWith(soundUrl)) {
      return
    }

    if (currentAudio.current && !currentAudio.current.paused) {
      fadingAudio.current = currentAudio.current
      fadeOut(fadingAudio.current, 1500)
    }

    const audio = new Audio(soundUrl)
    audio.loop = true
    currentAudio.current = audio

    const isFirstLoad = !loadedRef.current
    loadedRef.current = true
    fadeIn(audio, 0.25, isFirstLoad ? 500 : 1500)

    return () => {
      stopFade()
    }
  }, [condition, isNight, muted, fadeIn, fadeOut, stopFade])

  useEffect(() => {
    return () => {
      currentAudio.current?.pause()
      fadingAudio.current?.pause()
      stopFade()
    }
  }, [stopFade])
}
