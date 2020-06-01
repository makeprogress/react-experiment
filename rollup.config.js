import babel from '@rollup/plugin-babel'
import clear from 'rollup-plugin-clear'
import commonjs from '@rollup/plugin-commonjs'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import {terser} from 'rollup-plugin-terser'

import {main, module} from './package.json'

export default {
  external: {
    React: 'react',
  },
  input: 'index.js',
  output: [
    {
      exports: 'named',
      file: main,
      format: 'cjs',
    },
    {
      exports: 'named',
      file: main.replace('.js', '.min.js'),
      format: 'cjs',
      plugins: [terser()],
    },
    {
      exports: 'named',
      file: module,
      format: 'es',
    },
  ],
  plugins: [
    clear({
      targets: ['dist'],
      watch: true,
    }),
    peerDepsExternal(),
    resolve({
      extensions: ['.js', '.jsx', '.json'],
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
    }),
  ],
}
