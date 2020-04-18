import React from 'react'
import { render } from 'react-dom'

import App from '.'

import { MemoryRouter } from 'react-router-dom'

describe('<App />', () => {
  test('renders without exploding', () => {
    const div = document.createElement('div')
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
      div
    )
  })
})
