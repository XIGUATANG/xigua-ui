const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  // configureWebpack: {
  //   output: {
  //     // 微应用的包名，这里与主应用中注册的微应用名称一致
  //     library: 'shop-acc',
  //     // 将你的 library 暴露为所有的模块定义下都可运行的方式
  //     libraryTarget: 'umd',
  //     // 按需加载相关，设置为 webpackJsonp_VueMicroApp 即可
  //     chunkLoadingGlobal: 'webpackJsonp_shopAcc'
  //   },
  //   resolve: {
  //     fallback: {
  //       crypto: require.resolve('crypto-browserify'),
  //       stream: require.resolve('stream-browserify')
  //     }
  //   }
  // },
  chainWebpack: config => {
    config.module
    .rule('mjs$')
    .test(/\.mjs$/)
    .include.add(/node_modules/)
    .end()
    .type('javascript/auto')
    config.resolve.alias
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('views', resolve('src/views'))
      .set('router', resolve('src/router'))
      .set('utils', resolve('src/utils'))
      .set('types', resolve('src/types'))
      .set('api', resolve('src/api'))
      .set('hooks', resolve('src/hooks'))
  },
  devServer: {
    port: '8088',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}
