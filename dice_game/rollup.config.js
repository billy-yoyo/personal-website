// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import resolve from "@rollup/plugin-node-resolve";
import tslib from "tslib";
import css from "rollup-plugin-import-css";
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';

import React from 'react';
import ReactDOM from 'react-dom';

export default {
  input: 'src/index.tsx',
  output: {
    file: '../personal_website/static/dicegame/bundle.min.js',
    format: 'iife',
    name: 'version',
    watch: true,
    plugins: [terser()]
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    resolve({
      browser: true
    }),
    typescript({
      tslib,
      tsconfig: "./tsconfig.json"
    }),
    css({
      output: 'bundle.min.css'
    }),
    commonjs({
      include: /node_modules/,
      namedExports: {
          'react': Object.keys(React),
          'react-dom': Object.keys(ReactDOM),
      }
    })
  ]
};