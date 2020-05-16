const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config()

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: '[name].js',
  },
  devServer: {
    contentBase: './build',
    historyApiFallback: true,
    port: 4000,
  },
  target: 'web',
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      parallel: true,
      terserOptions: {
        ecma: 6,
        sourceMap: true,
        extractComments: true,
      },
    })],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        exclude: [
          /node_modules/,
          path.resolve('latest-v3'),
        ],
        loader: 'eslint-loader',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: [
          /node_modules/,
          path.resolve('latest-v3'),
        ],
        resolve: {
          extensions: ['.js', '.jsx'],
        },
        loader: 'babel-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images',
            },
          },
        ],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      title: 'NO',
      template: './src/index.html',
      filename: './index.html',
    }),
    new CopyPlugin([
      { from: 'src/static' },
    ]),
    new webpack.DefinePlugin({
      'process.env.READ_KEY': JSON.stringify(process.env.READ_KEY),
      'process.env.BUCKET_ID': JSON.stringify(process.env.BUCKET_ID),
      'process.env.WRITE_KEY': JSON.stringify(process.env.WRITE_KEY),
      'process.env.UNAME': JSON.stringify(process.env.UNAME),
      'process.env.UPW': JSON.stringify(process.env.UPW),
      'process.env.SC_CLIENT': JSON.stringify(process.env.SC_CLIENT),
    }),
  ],
}
