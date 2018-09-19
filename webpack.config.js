const path = require('path');
const entry = path.resolve(__dirname, 'src', 'selector.js');

module.exports = {
  entry,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'paraview-version.js',
  },
  module: {
    rules: [
      {
        test: entry,
        loader: 'expose-loader?PV',
      },
      {
        test: /\.js$/,
        use: [
          { loader: 'babel-loader', options: { presets: ['es2015'] } },
        ],
      },
    ],
  },
};
