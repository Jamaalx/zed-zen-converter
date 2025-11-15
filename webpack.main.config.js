module.exports = {
  entry: './src/main.js',
  target: 'electron-main',
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
  },
  externals: {
    'sharp': 'commonjs2 sharp',
    'fluent-ffmpeg': 'commonjs2 fluent-ffmpeg',
    'pdf-lib': 'commonjs2 pdf-lib',
    'mammoth': 'commonjs2 mammoth',
    'docx': 'commonjs2 docx'
  }
};