var env = (process.env.NODE_ENV || 'development').trim()
console.info('[Current environment]', env)

module.exports = {
  'process.env.NODE_ENV': JSON.stringify(env),
  __DEV__: env === 'development',
  __PROD__: env === 'production'
}
