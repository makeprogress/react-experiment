const path = require('path')

module.exports = {
  entry: './index.js',
  externals: {
    'prop-types': {
      amd: 'PropTypes',
      commonjs: 'prop-types',
      commonjs2: 'prop-types',
      root: 'PropTypes',
    },
    react: {
      amd: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      root: 'React',
    },
    'react-dom': {
      amd: 'ReactDOM',
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      root: 'ReactDOM',
    },
    'styled-components': {
      amd: 'styled',
      commonjs: 'styled-components',
      commonjs2: 'styled-components',
      root: 'styled',
    },
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  output: {
    filename: 'index.js',
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    alias: {
      'prop-types': path.resolve(__dirname, './node_modules/prop-types'),
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      'styled-components': path.resolve(__dirname, './node_modules/styled-components'),
    },
    extensions: ['.js', '.jsx'],
  },
}
