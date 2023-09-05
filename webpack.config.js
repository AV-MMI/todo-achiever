const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',

  entry: {
  	index: './src/index.js',
  },

  devtool: 'inline-source-map',

  plugins: [
    new HtmlWebpackPlugin({
    	template: './src/index.html',
    })
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, '/src'),
    },
    compress: true,
    port: 9000,
  },

  output: {
    filename: '[name]-bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {

        test: /\.(png|svg|jpg|jpeg|gif)$/i,

        type: 'asset/resource',

      },
    ],
  },

  optimization: {
  	runtimeChunk: 'single',
  },
};