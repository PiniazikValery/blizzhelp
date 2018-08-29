import path from 'path';
import webpack from 'webpack';

module.exports = {
  devtool: 'eval-source-map',
  entry: path.join(process.cwd(), 'client/src/index'),
  output: {
    filename: 'bundle.js',
    path: path.join(process.cwd(), 'client', 'public', 'js', 'bundled'),
    publicPath: '/js/bundled',
  },
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all',
  //   },
  // },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        use: 'eslint-loader',
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  target: 'web',
};
