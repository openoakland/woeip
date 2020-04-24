import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import App from './App'
import { MemoryRouter } from 'react-router-dom'

describe('<App />', () => {
  test('renders without exploding', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading')).toHaveTextContent('WOAQ')
    expect(screen.getByRole('list')).toHaveClass('Home-resources')
  })
})
