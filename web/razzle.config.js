'use strict';

const path = require('path')

module.exports = {
  plugins: ['scss', 'typescript'],
  modify: (defaultConfig, { target, dev }) => {
    const config = defaultConfig

    if (config.devServer) {
      // Handle HMR within docker env: https://github.com/jaredpalmer/razzle/issues/416
      config.devServer.watchOptions['poll'] = 1000;
      config.devServer.watchOptions['aggregateTimeout'] = 300;
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      routes: path.resolve('./src/routes'),
      theme: path.resolve('./src/theme')
    }

    return config
  }
}