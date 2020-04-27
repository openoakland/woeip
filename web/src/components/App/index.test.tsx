import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import App from '.'
import { MemoryRouter } from 'react-router-dom'

describe('<App />', () => {
  test('Superficial test confirming that modules are configured', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading')).toHaveTextContent('WOAQ')
    expect(screen.getByRole('list')).toHaveClass('Home-resources')
  })
})
