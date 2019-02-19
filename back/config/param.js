if (process.env.NODE_ENV === 'production') {
  console.log('production brach from param.js')
  module.exports = require('./param_prod')
} else {
  module.exports = require('./param_dev')
}
