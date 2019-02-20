if (process.env.NODE_ENV === 'production') {
  module.exports = require('./param_prod')
} else {
  module.exports = require('./param_dev')
}
