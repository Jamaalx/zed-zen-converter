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
      },
      {
        test: /\.node$/,
        loader: 'node-loader'
      }
    ]
  }
};