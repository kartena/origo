const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  output: {
    path: `${__dirname}/../js`,
    publicPath: '/js',
    filename: 'origo.js',
    libraryTarget: 'var',
    libraryExport: 'default',
    library: 'origo'
  },
  devtool: 'eval-source-map',
  devServer: {
    contentBase: './',
    port: 9966
  }
});
