import { describe, it, expect } from 'vitest'
import { degToDirection } from './WindWidget'

describe('Wind direction conversion', () => {
  it('converts 0 degrees to N', () => { expect(degToDirection(0)).toBe('N') })
  it('converts 90 degrees to E', () => { expect(degToDirection(90)).toBe('E') })
  it('converts 180 degrees to S', () => { expect(degToDirection(180)).toBe('S') })
  it('converts 270 degrees to W', () => { expect(degToDirection(270)).toBe('W') })
  it('converts 45 degrees to NE', () => { expect(degToDirection(45)).toBe('NE') })
  it('converts 315 degrees to NW', () => { expect(degToDirection(315)).toBe('NW') })
})
