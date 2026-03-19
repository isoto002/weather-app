import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProvider, setupMockFetch } from '../../test-utils'
import { Header } from './Header'

beforeEach(() => { setupMockFetch() })

describe('Header', () => {
  it('renders search input', () => {
    renderWithProvider(<Header />)
    expect(screen.getByPlaceholderText('Search city...')).toBeInTheDocument()
  })

  it('renders unit toggle button', () => {
    renderWithProvider(<Header />)
    expect(screen.getByLabelText(/switch to (celsius|fahrenheit)/i)).toBeInTheDocument()
  })

  it('renders theme toggle button', () => {
    renderWithProvider(<Header />)
    expect(screen.getByLabelText(/switch to.*mode/i)).toBeInTheDocument()
  })
})
