require('dotenv').config();
const createRequest = require('./index').createRequest

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 8080

app.use(bodyParser.json())

app.post('/', (req, res) => {
  console.log('POST Data: ', req.body)
  createRequest(req.body, (status, result) => {
    console.log('Result: ', result)
    res.status(status).json(result)
  })
});

//Stock Endpoint
app.get('/stock', (req, res) => {
  /*
  Accepts stockSymbols QS Param as String; ex: stockSymbols=SNAP,TWTR
  */
  createRequest(req, (result) => {
    res.json(result);
  })
});

app.listen(port, () => console.log(`Listening on port ${port}!`))
