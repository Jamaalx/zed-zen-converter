module.exports = {
  entry: './src/main.js',
  target: 'electron-main',
  externals: {
    'sharp': 'commonjs2 sharp'
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