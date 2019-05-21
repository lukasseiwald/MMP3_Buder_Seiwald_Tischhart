const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// Phaser webpack config
const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
const pixi = path.join(phaserModule, 'build/custom/pixi.js')
const p2 = path.join(phaserModule, 'build/custom/p2.js')

const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
})

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      path.resolve(__dirname, 'src/js/screen.js')
    ],
    controller: [
      'babel-polyfill',
      path.resolve(__dirname, 'src/js/controller.js')
    ],
    vendor: ['pixi', 'p2', 'phaser', 'webfontloader']
  },
  devtool: 'cheap-source-map',
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, './dist/js/'),
    publicPath: './js/', //for dev server
    filename: '[name].bundle.js'
  },
  watch: true,
  plugins: [
    new ExtractTextPlugin('../css/styles.css'),
    definePlugin,
    new CleanWebpackPlugin(
      ['dist/']
    ),
    new CopyWebpackPlugin([
      { from: 'src/assets', to: '../assets', force: true }
    ]),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor'/* chunkName= */, filename: 'vendor.bundle.js'/* filename= */}),
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: './src/index.html',
      chunks: [],
      chunksSortMode: 'manual',
      minify: {
        removeAttributeQuotes: false,
        collapseWhitespace: false,
        html5: false,
        minifyCSS: false,
        minifyJS: false,
        minifyURLs: false,
        removeComments: false,
        removeEmptyAttributes: false
      },
      hash: false
    }),
    new HtmlWebpackPlugin({
      filename: '../screen.html',
      template: './src/screen.html',
      chunks: ['vendor', 'app'],
      chunksSortMode: 'manual',
      minify: {
        removeAttributeQuotes: false,
        collapseWhitespace: false,
        html5: false,
        minifyCSS: false,
        minifyJS: false,
        minifyURLs: false,
        removeComments: false,
        removeEmptyAttributes: false
      },
      hash: false
    }),
    new HtmlWebpackPlugin({
      filename: '../controller.html',
      template: './src/controller.html',
      chunks: ['vendor', 'controller'],
      chunksSortMode: 'manual',
      minify: {
        removeAttributeQuotes: false,
        collapseWhitespace: false,
        html5: false,
        minifyCSS: false,
        minifyJS: false,
        minifyURLs: false,
        removeComments: false,
        removeEmptyAttributes: false
      },
      hash: false
    }),
    new BrowserSyncPlugin({
      host: process.env.IP || 'localhost',
      port: process.env.PORT || 3000,
      server: {
        baseDir: ['./dist', './build']
      }
    })
  ],
  module: {
    rules: [
      { test: /\.js$/,
        use: ['babel-loader'],
        include: path.join(__dirname, 'src') },
      {
        test: /pixi\.js/,
        use: ['expose-loader?PIXI']
      },
      { test:
        /phaser-split\.js$/,
        use: ['expose-loader?Phaser']
      },
      {
        test: /p2\.js/,
        use: ['expose-loader?p2']
      },
      {
        test:/\.scss$/,
        use: ExtractTextPlugin.extract({
            fallback:'style-loader',
            use:['css-loader','sass-loader'],
            publicPath: ''
        })
	    },
	    {
	      test: /\.(jpe?g|png|gif|svg)$/i,
	      exclude: [
	        path.resolve(__dirname, './node_modules'),
	      ],
	      use: {
	        loader: 'file-loader',
	        options: {
	          name: '[name]-[hash].[ext]',
	          outputPath: '../images',
	          publicPath: ''
	        },
	      }
	    }
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  resolve: {
    alias: {
      'phaser': phaser,
      'pixi': pixi,
      'p2': p2
    }
  }
}
