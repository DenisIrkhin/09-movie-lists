const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const testsRoute = require('./routes/tests')
const usersRoute = require('./routes/users')

const PORT = 5050

app.use(cors())
// For future cookie implementation
// app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

// Might be usefull
// basically tells the system whether you want to use a simple algorithm for shallow parsing (i.e. false) or complex algorithm for deep parsing that can deal with nested objects (i.e. true).
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

// Use routes
app.use('/tests', testsRoute)
app.use('/users', usersRoute)

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}...`)
})
