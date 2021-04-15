const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: __dirname,
  },
  module: {
    rules: [
        {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            options: { presets: ["@babel/preset-react"] },
        },
        {
            test: /\.(webp|png|jpg)$/i,
            loader: "file-loader",
        }
    ],
  },
};
