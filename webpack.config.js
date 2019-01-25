// webpack.config.js
const path = require('path');
const webpack = require( 'webpack' );
const chalk = require('chalk');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
module.exports = {
  mode: "production",   // production | development | none
  entry: './src/main.js',    // string | object | array
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: "/assets/"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader','css-loader']
      },
      {
        test: /\.styl$/,
        loader: ['style-loader', 'css-loader', 'stylus-loader']
      },
      // {
      //  test: /\.scss$/,
      //  loader: ['style-loader', 'css-loader', 'sass-loader']
      // },      
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: '../fonts/'     // index.html cannot see dist/fonts
            }
          }]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
            loader: 'file-loader',
            options: {}
        }]
      }
    ]    
  },
  resolve: {
    extensions: ['*', '.js', '.vue', '.json'],
    alias: { 
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve('./src') 
    },
  },
  plugins: [
    new VueLoaderPlugin(),
    new VuetifyLoaderPlugin(),
    new ProgressBarPlugin({
      format: ' build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds) [:msg] ',
      clear: false
    })
    // new MomentLocalesPlugin({ localesToKeep: ['es-us', 'ru'] })
    // new HtmlWebpackPlugin({ template: './index.html' })
  ],
  devServer: {
    proxy: [{
      context: ['/php', '/api'],
      target: 'http://wp4project',
      changeOrigin: true,
      secure: false      
    }]
  }
}
