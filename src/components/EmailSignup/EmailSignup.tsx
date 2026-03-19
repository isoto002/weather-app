import { useState } from 'react'
import { useWeatherContext } from '../../context/WeatherContext'
import { subscribeToEmail } from '../../lib/firebase'

export function EmailSignup() {
  const { city, unit } = useWeatherContext()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || !city) return

    if (!isValidEmail(trimmed)) {
      setStatus('error')
      setErrorMsg('Please enter a valid email address.')
      return
    }

    setStatus('loading')
    try {
      await subscribeToEmail(trimmed, city.name, unit)
      setStatus('success')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setErrorMsg('Failed to subscribe. Please try again.')
    }
  }

  return (
    <section className="px-4 max-w-3xl mx-auto mt-4">
      <div className="glass p-5">
        <p className="text-[9px] uppercase tracking-[0.15em] text-white/40 mb-1">
          Daily Weather Email
        </p>
        <p className="text-sm text-white/60 mb-4">
          Get a daily weather forecast for {city?.name ?? 'your city'} delivered to your inbox at 7am.
        </p>

        {status === 'success' ? (
          <p className="text-green-400 text-sm">
            Subscribed! Check your inbox tomorrow morning.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              aria-label="Email address for daily weather alerts"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/20"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="glass px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? '...' : 'Subscribe'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="text-red-400 text-xs mt-2">{errorMsg}</p>
        )}
      </div>
    </section>
  )
}
