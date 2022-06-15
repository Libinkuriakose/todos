
require('dotenv').config({
    path: `${__dirname}/.env`
})

const express = require("express")
const cors = require('cors')
const mongo = require("./config/mongo")
const app = express()
const cron = require('./helpers/cron')


app.use(cors())
app.use(express.json()); 

(async () => {
  await mongo.connect()
  cron.cronCheck.start()
  console.log("mongodb connection completed")
})()

const routes = require('./config/routes')
app.use('/v1', routes)

const port = process.env.PORT || '8008'

//kldj6
app.listen(port, () => {
  console.log('listening on port', port)
})
