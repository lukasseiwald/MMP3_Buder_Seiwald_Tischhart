const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// Phaser webpack config
const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
const pixi = path.join(phaserModule, 'build/custom/pixi.js')
const p2 = path.join(phaserModule, 'build/custom/p2.js')

const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false'))
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
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, './build/js/'),
    filename: '[name].bundle.js'
  },
  plugins: [
		new ExtractTextPlugin('../css/styles.css'),
    definePlugin,
    new CleanWebpackPlugin(['build']),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.optimize.UglifyJsPlugin({
      drop_console: true,
      minimize: true,
      output: {
        comments: false
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' /* chunkName= */ , filename: 'vendor.bundle.js' /* filename= */ }),
    new HtmlWebpackPlugin({
      filename: '../screen.html',
      template: './src/screen.html',
      chunks: ['vendor', 'app'],
      chunksSortMode: 'manual',
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        html5: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
        removeComments: true,
        removeEmptyAttributes: true
      },
      hash: true
    }),
    new HtmlWebpackPlugin({
      filename: '../controller.html',
      template: './src/controller.html',
      chunks: ['vendor', 'controller'],
      chunksSortMode: 'manual',
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        html5: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
        removeComments: true,
        removeEmptyAttributes: true
      },
      hash: true
    }),
    new CopyWebpackPlugin([
      { from: 'src/assets', to: '../assets' }
    ])
  ],
  module: {
    rules: [
      {
				test: /\.js$/,
				use: ['babel-loader'],
				include: path.join(__dirname, 'src')
			},
      {
				test: /pixi\.js/,
				use: ['expose-loader?PIXI']
			},
      {
				test: /phaser-split\.js$/,
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
