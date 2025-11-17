const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname),
    },
    historyApiFallback: true,
    port: 3000,
  },
  mode: 'development',
};
