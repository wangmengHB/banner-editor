const path = require('path');

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
      'demo': path.resolve(__dirname, '../src/demo')
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js',
        publicPath: '/',
        libraryTarget: 'umd',
        library: 'demo'
    },
    resolve: {
      extensions: ['.ts', '.js', '.tsx', '.jsx', '.json'],
    },
    module: {
        rules: [
          {
            test: /\.(js|ts|jsx|tsx)$/,
            include: [
              path.resolve(__dirname, '../src')
            ],
            use: [
              {
                loader: 'babel-loader',
              },
              {
                loader: 'ts-loader',
              }
            ]
          },
          {
            test: /\.(less|css)$/,
            exclude: path.resolve(__dirname, '../node_modules'),
            use: [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    mode: 'local',
                    localIdentName: '[name]__[local]--[hash:base64:5]',
                  },
                }
              },
              {
                loader: 'less-loader',
                options: {
                  javascriptEnabled: true,
                }
              }
            ]
          },
          {
            test: /\.(less|css)$/,
            include: path.resolve(__dirname, '../node_modules'),
            use: [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
              },
              {
                loader: 'less-loader',
                options: {
                  javascriptEnabled: true,
                }
              }
            ]
          },
          {
            test: /\.(svg|jpg|jpeg|png)$/,
            use: [
              {
                loader: 'file-loader',
              }
            ]
          }
        ]
    },
    node: {
      setImmediate: false,
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    }
}