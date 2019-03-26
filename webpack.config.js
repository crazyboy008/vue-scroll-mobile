const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production'

let plugins = [
  new VueLoaderPlugin()
]
if (!isProduction) [
  plugins.push(
    new HtmlWebpackPlugin({
      filename: 'demo.html',
      template: './public/index.html',
      inject: true
    })
  )
]

module.exports = {
    entry: isProduction ? './src/index.js' : './src/main.js',
    output:{
        path: isProduction ? path.join(__dirname,'./dist') : path.join(__dirname,'./demo'),
        publicPath:'',
        filename:'vue-scroll-m.js',
        globalObject: 'this',
        libraryExport: "default",
        libraryTarget: "umd",
        library: 'VueScrollM',
        umdNamedDefine: true
    },
    module:{
        rules:[
            {
               test:/\.js$/,
               loader:'babel-loader',
               include:path.join(__dirname,'src'),
               exclude:/node_modules/
            },
            {
                test:/\.vue$/,
                loader:'vue-loader',
                include:path.join(__dirname,'src'),
                exclude:/node_modules/,
            },
            {
              test: /\.less$/,
              use: [
                'vue-style-loader',
                'css-loader',
                'postcss-loader',
                'less-loader'
              ]
            },
        ]
    },
    plugins: [...plugins]
}