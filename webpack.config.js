// webpack.config.js
const path = require('path');
const webpack = require( 'webpack' );
const chalk = require('chalk');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const WebpackMonitor = require('webpack-monitor');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
module.exports = {
  mode: "development",   // production | development | none
  entry: './src/main.js',    // string | object | array
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: "/assets/"
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.vue$/, loader: 'vue-loader' },
      { test: /\.css$/, use: ['style-loader','css-loader'] },
      { test: /\.styl$/, loader: ['style-loader', 'css-loader', 'stylus-loader'] },
      { test: /\.scss$/, loader: ['style-loader', 'css-loader', 'sass-loader'] },
      { test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: { name: '[name].[ext]', outputPath: '../fonts/' } // index.html cannot see dist/fonts
          }]
      },
      { test: /\.(png|jpg|gif)$/, use: [{ loader: 'file-loader', options: {} }] }
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
    new webpack.ContextReplacementPlugin(
      /moment[\/\\]locale/,
      /(en-gb|ru)\.js/,   // regular expression to select files to import
    ),
    new VueLoaderPlugin(),
    new VuetifyLoaderPlugin(),
    new ProgressBarPlugin({
      format: ' build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds) [:msg] ',
      clear: false
    }),
    new WebpackMonitor({
      capture: true, // -> default 'true'
      target: '../monitor/myStatsStore.json', // default -> '../monitor/stats.json'
      launch: true, // -> default 'false'
      port: 3030, // default -> 8081
      excludeSourceMaps: true // default 'true'
    })   
    // new MomentLocalesPlugin({ localesToKeep: ['es-us', 'ru'] })
    // new HtmlWebpackPlugin({ template: './index.html' })
  ],
  devServer: {
    proxy: [{
      context: ['/php', '/api'],
      target: 'http://starpunter',
      changeOrigin: true,
      secure: false      
    }]
  }
}
