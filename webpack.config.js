var path = require('path');

const webpack = require('webpack');
const HappyPack = require('happypack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname);
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');
var APP_PATH = path.resolve(ROOT_PATH, 'app');

module.exports= {
  entry: path.resolve(APP_PATH, 'app.jsx'),
  output: {
    path: BUILD_PATH,
    filename: 'bundle-[hash:5].js'
  },
  devtool: 'eval-source-map',
  devServer: {
    historyApiFallback: true,
    hot: true,
    host: '',
    port: '8081',
    contentBase: ROOT_PATH
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    modules: [APP_PATH, "node_modules"]
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      use: [
        'babel-loader',
      ],
      include: APP_PATH
    }, {
      test: /\.(scss|css)$/,
      use: ExtractTextPlugin.extract({
        use: [{
          loader: 'css-loader',
          options: {
            modules: false,
            importLoaders: 1,
            localIdentName: '[local]-[hash:base64:5]',
            minimize: true,
            sourceMap: true,
          }
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          }
        }],
        fallback: 'style-loader',
      }),
    }, {
      test: /\.(png|jpg|gif)$/,
      loader: 'url-loader?&name=[name]-[hash:base64:5].[ext]&outputPath=assets/images/',
      options: {
        limit: 20480,
      }
    }, {
      test: /\.(svg|eot|ttf|woff|woff2)$/,
      loader: 'file-loader?&name=[name]-[hash:base64:5].[ext]&outputPath=assets/fonts/',
    }, {
      test: /\.pdf$/,
      loader: 'file-loader?minetype=application/pdf&name=[name]-[hash:base64:5].[ext]&outputPath=assets/',
    }, ],
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'babel-polyfill': 'window',
  },
  plugins: [
    new HappyPack({
      loaders: [{
        loader: 'babel-loader'
      }],
      threads: 2
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(APP_PATH, 'index.html'),
      filename: 'index.html',
      inject: 'body',
    }),
    new ExtractTextPlugin({
      filename: 'index-[hash:5].css',
      disable: false,
      allChunks: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
};