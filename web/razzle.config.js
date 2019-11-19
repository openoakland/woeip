'use strict'

const path = require('path')

module.exports = {
  plugins: ['typescript'],
  modify: (defaultConfig, { target, dev }) => {
    const config = defaultConfig

    if (config.devServer) {
      // Handle HMR within docker env: https://github.com/jaredpalmer/razzle/issues/416
      config.devServer.watchOptions['poll'] = 1000
      config.devServer.watchOptions['aggregateTimeout'] = 300
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      components: path.resolve('./src/components'),
      containers: path.resolve('./src/containers'),
      pages: path.resolve('./src/pages'),
      routes: path.resolve('./src/routes'),
      images: path.resolve('./src/images'),
      css: path.resolve('./src/css')
    }

    return config
  }
}
