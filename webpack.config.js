var webpack = require('webpack');
var pkg = require('./package.json');
var env = process.env.WEBPACK_ENV;
var name = 'grapick';
var plugins = [];

if(env !== 'dev') {
  plugins = [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin({minimize: true, compressor: {warnings: false}}),
    new webpack.BannerPlugin(pkg.name + ' - ' + pkg.version),
  ]
}

module.exports = {
  entry: './src',
  output: {
      filename: './dist/' + name + '.min.js',
      library: 'Grapick',
      libraryTarget: 'umd',
  },
  plugins: plugins,
  module: {
    loaders: [{
        test: /\.js$/,
        loader: 'babel-loader',
        include: /src/,
        exclude: /node_modules/
    }],
  },
  resolve: {
    modules: ['node_modules'],
  },
}
