const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const testRoute = require('./routes/test')

const PORT = 4000

app.use(cors())
// For future cookie implementation
// app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

// We'll use json only
// app.use(bodyParser.raw({ type: '*/*' }))
app.use(bodyParser.json())

// Use routes
app.use('/tests', testRoute)

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}...`)
})
