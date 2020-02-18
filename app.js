//Import Global
const global = require('./global');

//Setup Constants
const createRequest = require('./index').createRequest
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 8080

app.use(bodyParser.json())

///stock POST Endpoint
//Required Parameters are id and data.stockSymbols is optional.
app.post('/stock', (req, res) => {
  console.log('POST to /stock Received ', req);
  global.logger.info('POST to /stock Received ', req);
  if(id){
    createRequest(req, (status, result) => {
      res.status(status).json(result);
    });
  }else{
    res.status(500).json({error:'Please provide Job Run ID as id in body of request.'});
  }

});

app.listen(port, ()=> {
  global.logger.info(`Server Started! Listening on port ${port}!`);
});
