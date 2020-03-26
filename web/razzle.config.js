'use strict';

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
      components: path.resolve('./src/components'),	
      routes: path.resolve('./src/routes')
    }

    return config
  }
}