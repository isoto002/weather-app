interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  life: number
}

interface ShootingStar {
  x: number
  y: number
  vx: number
  vy: number
  length: number
  opacity: number
  life: number
  maxLife: number
}

interface Splash {
  x: number
  y: number
  radius: number
  maxRadius: number
  opacity: number
  life: number
}

type ParticleType = 'rain' | 'snow' | 'clouds' | 'sun' | 'lightning' | 'fog' | 'stars' | 'none'

export class ParticleEngine {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private particles: Particle[] = []
  private animationId: number | null = null
  private type: ParticleType = 'none'
  private speed: number = 1
  private maxParticles: number = 0
  private lightningTimer: number = 0
  private lightningFlash: boolean = false
  private shootingStars: ShootingStar[] = []
  private shootingStarTimer: number = 0
  private splashes: Splash[] = []

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.resize()
  }

  resize() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  configure(type: ParticleType, count: number, speed: number) {
    this.type = type
    this.maxParticles = count
    this.speed = speed
    this.particles = []
    this.shootingStars = []
    this.shootingStarTimer = 0
    this.splashes = []

    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle())
    }
  }

  private createParticle(): Particle {
    const w = this.canvas.width
    const h = this.canvas.height

    switch (this.type) {
      case 'rain':
        return {
          x: Math.random() * w,
          y: Math.random() * h - h,
          vx: Math.random() * 0.5 - 0.25,
          vy: this.speed + Math.random() * 4,
          size: 1 + Math.random() * 1.5,
          opacity: 0.2 + Math.random() * 0.4,
          life: 1,
        }
      case 'snow':
        return {
          x: Math.random() * w,
          y: Math.random() * h - h,
          vx: Math.random() * 1 - 0.5,
          vy: this.speed * (0.5 + Math.random() * 0.5),
          size: 2 + Math.random() * 4,
          opacity: 0.3 + Math.random() * 0.5,
          life: 1,
        }
      case 'stars':
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: 0,
          vy: 0,
          size: 1 + Math.random() * 2,
          opacity: Math.random(),
          life: Math.random() * Math.PI * 2,
        }
      case 'clouds':
        return {
          x: Math.random() * w - w * 0.2,
          y: Math.random() * h * 0.6,
          vx: this.speed * (0.2 + Math.random() * 0.3),
          vy: 0,
          size: 80 + Math.random() * 120,
          opacity: 0.03 + Math.random() * 0.06,
          life: 1,
        }
      case 'sun':
        return {
          x: w * 0.5 + (Math.random() - 0.5) * w,
          y: h * 0.3 + (Math.random() - 0.5) * h * 0.3,
          vx: 0,
          vy: 0,
          size: 50 + Math.random() * 100,
          opacity: 0.02 + Math.random() * 0.04,
          life: Math.random() * Math.PI * 2,
        }
      case 'fog':
        return {
          x: Math.random() * w * 1.5 - w * 0.25,
          y: Math.random() * h,
          vx: this.speed * (0.3 + Math.random() * 0.2),
          vy: 0,
          size: 200 + Math.random() * 200,
          opacity: 0.02 + Math.random() * 0.04,
          life: 1,
        }
      default:
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: this.speed + Math.random() * 4,
          vy: this.speed + Math.random() * 4,
          size: 2,
          opacity: 0.4,
          life: 1,
        }
    }
  }

  start() {
    if (this.animationId !== null) return
    const animate = () => {
      this.update()
      this.draw()
      this.animationId = requestAnimationFrame(animate)
    }
    animate()
  }

  stop() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  private update() {
    const w = this.canvas.width
    const h = this.canvas.height

    if (this.type === 'lightning') {
      this.lightningTimer++
      if (this.lightningTimer > 200 + Math.random() * 300) {
        this.lightningFlash = true
        this.lightningTimer = 0
        setTimeout(() => { this.lightningFlash = false }, 100)
      }
    }

    // Shooting stars — only during night (stars particle type)
    if (this.type === 'stars') {
      this.shootingStarTimer++
      // Spawn one roughly every 3-8 seconds (at ~60fps)
      if (this.shootingStarTimer > 180 + Math.random() * 300) {
        this.shootingStarTimer = 0
        const angle = Math.PI * 0.15 + Math.random() * Math.PI * 0.2 // ~25-65° downward
        const speed = 6 + Math.random() * 6
        this.shootingStars.push({
          x: Math.random() * w * 0.8,
          y: Math.random() * h * 0.4,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          length: 40 + Math.random() * 60,
          opacity: 0.7 + Math.random() * 0.3,
          life: 0,
          maxLife: 30 + Math.random() * 30,
        })
      }

      // Update active shooting stars
      for (const s of this.shootingStars) {
        s.x += s.vx
        s.y += s.vy
        s.life++
      }
      // Remove dead ones
      this.shootingStars = this.shootingStars.filter((s) => s.life < s.maxLife)
    }

    // Update splashes
    for (const s of this.splashes) {
      s.life++
      s.radius += (s.maxRadius - 1) / 15
      s.opacity *= 0.9
    }
    this.splashes = this.splashes.filter((s) => s.opacity > 0.02)

    for (const p of this.particles) {
      p.x += p.vx
      p.y += p.vy

      if (this.type === 'stars' || this.type === 'sun') {
        p.life += 0.01
        p.opacity = 0.3 + Math.sin(p.life) * 0.4
      }

      if (this.type === 'snow') {
        p.vx = Math.sin(p.y * 0.01) * 0.5
      }

      // Reset particles that go off screen
      if (p.y > h + 20) {
        if ((this.type === 'rain' || this.type === 'lightning') && this.splashes.length < 10) {
          this.splashes.push({
            x: p.x,
            y: h - 5 + Math.random() * 10,
            radius: 1,
            maxRadius: 3 + Math.random() * 2,
            opacity: 0.4,
            life: 0,
          })
        }
        p.y = -20
        p.x = Math.random() * w
      }
      if (p.x > w + 50) {
        p.x = -50
      }
    }
  }

  private draw() {
    const ctx = this.ctx
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    if (this.type === 'lightning' && this.lightningFlash) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }

    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity))

      switch (this.type) {
        case 'rain':
        case 'lightning':
          ctx.strokeStyle = 'rgba(174, 194, 224, 0.6)'
          ctx.lineWidth = p.size
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x + p.vx * 2, p.y + p.vy * 2)
          ctx.stroke()
          break

        case 'snow':
          ctx.fillStyle = 'white'
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
          break

        case 'stars':
          ctx.fillStyle = 'white'
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
          break

        case 'clouds':
        case 'fog':
          ctx.fillStyle = 'rgba(255, 255, 255, 1)'
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
          break

        case 'sun':
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
          gradient.addColorStop(0, 'rgba(255, 223, 100, 0.15)')
          gradient.addColorStop(1, 'rgba(255, 223, 100, 0)')
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
          break
      }
    }

    // Draw rain splashes
    if (this.type === 'rain' || this.type === 'lightning') {
      for (const s of this.splashes) {
        ctx.globalAlpha = s.opacity
        ctx.strokeStyle = 'rgba(174, 194, 224, 0.6)'
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    // Draw shooting stars
    if (this.type === 'stars') {
      for (const s of this.shootingStars) {
        const fade = 1 - s.life / s.maxLife
        const tailX = s.x - (s.vx / Math.sqrt(s.vx * s.vx + s.vy * s.vy)) * s.length
        const tailY = s.y - (s.vy / Math.sqrt(s.vx * s.vx + s.vy * s.vy)) * s.length

        const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY)
        grad.addColorStop(0, `rgba(255, 255, 255, ${s.opacity * fade})`)
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)')

        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(tailX, tailY)
        ctx.stroke()

        // Bright head
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity * fade})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    ctx.globalAlpha = 1
  }

  destroy() {
    this.stop()
    this.particles = []
  }
}
