module.exports = {
  entry: './src/main.js',
  target: 'electron-main',
  externals: {
    'sharp': 'commonjs sharp',
    'fluent-ffmpeg': 'commonjs fluent-ffmpeg',
    'pdf-lib': 'commonjs pdf-lib',
    'mammoth': 'commonjs mammoth',
    'docx': 'commonjs docx'
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