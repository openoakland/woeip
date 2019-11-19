import React from 'react'
import { hydrate } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import 'css/App.css'

import App from 'components/App'

hydrate(
  <BrowserRouter>
    <App style={} />
  </BrowserRouter>,
  document.getElementById('root')
)

if (module.hot) {
  module.hot.accept()
}
