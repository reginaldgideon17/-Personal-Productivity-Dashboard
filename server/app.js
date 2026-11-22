const express = require('express')
const cors = require('cors')
const logger = require('./middleware/logger')
const routes = require('./routes/index.js')

const app = express()

app.use(express.json)
app.use(cors)
app.use(logger)
app.use('/api',routes)

module.exports = app