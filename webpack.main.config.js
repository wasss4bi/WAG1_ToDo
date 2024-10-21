/* const path = require('path'); */
sqlite3 = require('sqlite3');
module.exports = {

  entry: './src/main.js',
  module: {
    rules: require('./webpack.rules'),
  },
  target: 'electron-main', 
  /* externals: {
    sqlite3: sqlite3
  }, */
  /* mode: 'development', 
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, '.webpack/main'),
    filename: 'index.js'
  },
  target: 'electron-main',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: {
    sqlite3: 'commonjs sqlite3'
  } */
};
