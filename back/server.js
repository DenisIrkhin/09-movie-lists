const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')

// Bring server config parameters depending on where the server runs
const config = require('./config/srv-config')

const testsRoute = require('./routes/api/tests')
const usersRoute = require('./routes/api/users')
const listsRoute = require('./routes/api/lists')

const PORT = config.ML_PORT

app.use(cookieParser())

// app.use(cors())
// For future cookie implementation
app.use(cors({ credentials: true, origin: config.CORS }))

// Might be usefull
// basically tells the system whether you want to use a simple algorithm for shallow parsing (i.e. false) or complex algorithm for deep parsing that can deal with nested objects (i.e. true).
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

// Use routes
app.use('/tests', testsRoute)
app.use('/users', usersRoute)
app.use('/lists', listsRoute)

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}...`)
})
