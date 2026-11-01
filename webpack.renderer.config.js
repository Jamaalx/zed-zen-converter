// Forge calls this with { mode }. Babel 8's preset-react picks the JSX dev
// runtime unless told otherwise, and React 19's production build has no
// jsxDEV, so the packaged app rendered a blank window.
module.exports = (_env, { mode } = {}) => ({
  target: 'web',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-react', {
                runtime: 'automatic',
                development: mode === 'development'
              }]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      "path": false,
      "fs": false,
      "events": false,
      "util": false,
      "stream": false
    }
  }
});
