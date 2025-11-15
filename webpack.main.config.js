module.exports = {
  entry: './src/main.js',
  target: 'electron-main',
  externals: {
    'sharp': 'commonjs2 sharp',
    'pdf-parse': 'commonjs2 pdf-parse',
    '@ffmpeg-installer/ffmpeg': 'commonjs2 @ffmpeg-installer/ffmpeg'
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