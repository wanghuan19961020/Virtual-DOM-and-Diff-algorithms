// https://webpack.docschina.org/
const path = require('path')

module.exports = {
  // 入口
  entry: './src/index.js',
  // 出口
  output: {
    // 虚拟打包路径，就是说文件夹不会真正生成，而是在 8080 端口虚拟生成
    publicPath: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
}
