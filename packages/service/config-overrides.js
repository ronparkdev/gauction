/* config-overrides.js */
const path = require('path')

const { override, babelInclude, addWebpackAlias, addWebpackModuleRule } = require('customize-cra')

module.exports = {
  webpack: override(
    babelInclude([path.resolve('src')]),
    addWebpackAlias({
      service: path.resolve(__dirname, 'src'),
    }),
    addWebpackModuleRule({
      test: /\.worker\.(c|m)?js$/i,
      use: [
        {
          loader: 'worker-loader',
          options: {
            filename: '[name].[contenthash].worker.js',
          },
        },
        {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      ],
    }),
  ),
}
