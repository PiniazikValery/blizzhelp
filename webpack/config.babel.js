import path from 'path';
import webpack from 'webpack';

module.exports = {
  devtool: 'eval-source-map',
  mode: 'production',
  entry: path.join(process.cwd(), 'client/src/index'),
  output: {
    filename: 'bundle.js',
    path: path.join(process.cwd(), 'client', 'public', 'bundled'),
    publicPath: '/bundled',
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  performance: { hints: false },
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
