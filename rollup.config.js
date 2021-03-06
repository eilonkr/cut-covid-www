import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [{
  input: 'src/hub.sw.js',
  output: {
    file: 'hub.sw.bundle.js',
    format: 'iife'
  }
}, {
  input: 'src/hub.js',
  output: {
    file: 'dist/hub.js',
    format: 'iife'
  },
    plugins: [nodeResolve({browser: true})]
} , {
  input: 'src/check.js',
  output: {
    file: 'dist/check.js',
    format: 'iife'
  }
} ]
