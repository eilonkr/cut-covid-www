export default [{
  input: 'src/hub.sw.js',
  output: {
    file: 'hub.sw.bundle.js',
    format: 'iife'
  }
} , {
  input: 'src/check.js',
  output: {
    file: 'dist/check.js',
    format: 'iife'
  }
} ]
