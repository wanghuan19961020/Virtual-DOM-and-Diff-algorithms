// https://webpack.docschina.org/
const path = require('path')

module.exports = {
  // 入口
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
}
