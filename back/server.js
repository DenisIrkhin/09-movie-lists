const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const path = require('path')

const app = express()

// Set process.env variable from .env
// require('dotenv').config() // we use a command in package.json instead
// console.log('process.env.ML_SERVER_PORT ', process.env.ML_SERVER_PORT)
// console.log('process.env.NODE_ENV ', process.env.NODE_ENV)
// console.log('process.env.ML_CORS ', process.env.ML_CORS)
// console.log('process.env.ML_MONGO_URL ', process.env.ML_MONGO_URL)

// Bring server config parameters depending on where the server runs
const config = require('./config/param')
// console.log('config ', config)


// Might be usefull
// basically tells the system whether you want to use a simple algorithm for shallow parsing (i.e. false) or complex algorithm for deep parsing that can deal with nested objects (i.e. true).
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const testsRoute = require('./routes/api/tests')
const usersRoute = require('./routes/api/users')
const listsRoute = require('./routes/api/lists')
const reviewsRoute = require('./routes/api/reviews')
const pmntsRoute = require('./routes/api/pmnts')


// Use cookieParser
app.use(cookieParser())

// Set Cookie
app.use(cors({ credentials: true, origin: config.CORS }))

// app.use(cors()) // Without cookie
// DB config with mongoose
const uri = config.MONGO_DO
console.log('uri', uri)

;(async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true })
    console.log('MongoDB Connected')
  } catch (error) {
    console.log(error)
  }
})()

// Passport middleware
app.use(passport.initialize())

// Passport Config
require('./lib/passport')(passport)

// Routes import
const testsRoute = require('./routes/api/tests')
const usersRoute = require('./routes/api/users')
const listsRoute = require('./routes/api/lists')
const pmntsRoute = require('./routes/api/pmnts')
const profilesRoute = require('./routes/api/profiles')

// Use routes
app.use('/api/tests', testsRoute)
app.use('/api/users', usersRoute)
app.use('/api/lists', listsRoute)
app.use('/api/reviews', reviewsRoute)
app.use('/api/pmnts', pmntsRoute)
app.use('/api/profiles', profilesRoute)

// Serve React static assets if in production
console.log('process.env.NODE_ENV ', process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  // console.log('express static', express.static('/../front/build'))
  app.use(express.static('../front/build'))

  app.get('*', (req, res) => {
    // console.log('path resolve ', path.resolve(__dirname, '/../front/build', 'index.html'))
    res.sendFile(path.resolve(__dirname, '../front/build', 'index.html'))
  })
}

app.listen(config.SERVER_PORT, () => {
  console.log(`listening on port ${config.SERVER_PORT}...`)
})
