module.exports = {
  entry: './src/main.js',
  target: 'electron-main',
  externals: {
    'sharp': 'commonjs2 sharp',
    'pdf-parse': 'commonjs2 pdf-parse',
    'ffmpeg-static': 'commonjs2 ffmpeg-static'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};