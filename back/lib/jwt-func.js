// JWT functions module
const jwt = require('jsonwebtoken')
const config = require('../config/param')

const secret = config.ML_JWT_SECRET

module.exports = async function jwtSign (payload) {
  console.log('from jwtSign func')
  try {
    const token = await ('Bearer ' + jwt.sign(payload, secret, {
      expiresIn: '36h'
    }))
    console.log('token ', token)
    return token
  } catch (error) {
    console.log('error', error)
  }
}
