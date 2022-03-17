// vue.config.js
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

module.exports = {
  // devServer: {
  //   proxy: 'http://localhost:8080',
  //   changeOrigin: true,
  // }
  // pluginOptions: {
  //   'style-resources-loader': {
  //     preProcessor: 'scss',
  //     patterns: []
  //   }
  // }
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    // devtool: 'clean-module-eval-source-map'
  },

  transpileDependencies: true,
  lintOnSave:false,

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: []
    }
  }
}
  
