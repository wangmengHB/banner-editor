const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.conf.js')
const path = require('path');

const config = merge(base, {
  entry: {
    'demo': path.resolve(__dirname, '../src/index')
  },
  mode: 'development',
  watch: true,
  devtool: 'none',
  devServer: {
    clientLogLevel: 'warning',
    hot: true,
    contentBase: false, 
    compress: true,
    host: '0.0.0.0',
    port: 8082,
    useLocalIp: true,
    open: true,
    overlay: { 
        warnings: false, 
        errors: true 
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'demo'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
})

module.exports = config