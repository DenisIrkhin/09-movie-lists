console.log('from param_prod.js')
console.log('process.env.ML_MONGO_URL', process.env.ML_MONGO_URL)
module.exports = {
  mongoURL: process.env.ML_MONGO_URL,
  CORS: process.env.ML_CORS,
  SERVER_PORT: process.env.ML_SERVER_PORT
}
