const path = require('path');
const nodeExternals = require('webpack-node-externals');

const clientConfig = {
  mode: 'development',
  entry: './src/client/index.tsx',
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'app.js',
    publicPath: '/js/'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  devtool: 'eval-source-map'
};

const serverConfig = {
  mode: 'development',
  entry: './src/server/server.ts',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  devtool: 'source-map'
};

module.exports = [clientConfig, serverConfig];