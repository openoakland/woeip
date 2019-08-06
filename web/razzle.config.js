'use strict';

module.exports = {
  plugins: ['typescript'],
  modify: (defaultConfig, { target, dev }) => {
    const config = defaultConfig

    if (config.devServer) {
      // Handle HMR within docker env: https://github.com/jaredpalmer/razzle/issues/416
      config.devServer.watchOptions['poll'] = 1000;
      config.devServer.watchOptions['aggregateTimeout'] = 300;
    }

    return config
  }
}