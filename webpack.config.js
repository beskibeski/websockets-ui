const path = require('path');
const Dotenv = require('dotenv-webpack');

const isProduction = process.env.NODE_ENV == 'production';

const config = {
  entry: './index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    host: '0.0.0.0',
  },
  plugins: [
    new Dotenv(),   
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
      },      
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
  },
  target: 'node',
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';    
  } else {
    Object.assign(config, {
      mode: 'development',
      devtool: 'inline-source-map',
    });
  }
  return config;
};
