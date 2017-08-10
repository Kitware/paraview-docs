const path = require('path');

module.exports = {
  entry: './src/selector.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'paraview-version.js'
  }
};
