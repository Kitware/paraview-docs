const path = require('path');

module.exports = {
  entry: './src/selector.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'paraview-version.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          { loader: 'babel-loader', options: { presets: ['es2015'] } },
        ],
      },
    ],
  },
};
