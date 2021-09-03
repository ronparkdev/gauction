/* config-overrides.js */
const path = require('path')

const { override, babelInclude, addWebpackAlias } = require('customize-cra')

module.exports = {
  webpack: override(
    babelInclude([path.resolve('src')]),
    addWebpackAlias({
      service: path.resolve(__dirname, 'src'),
    }),
  ),
}
