//Import Global
const global = require('./global');

//Import Request Node Module
const request = require('request');

//All API Constants
const apiToken = process.env.API_KEY;
const apiEndpoint = 'https://api.worldtradingdata.com/api/v1/';
const stockEndpoint = `${apiEndpoint}stock`;
const defaultStockSymbols = [
  'SNAP',
  'TWTR',
  'VOD.L'
];

const createRequest = (req, callback) => {
  // Get stockSymbol property from request body if provided, otherwise use defaults.
  var stockSymbol = req.body.data.stockSymbols? req.body.data.stockSymbols.join(',') : defaultStockSymbols.join(',');
  global.setLogMessage(`Stock Symbols to use: ${stockSymbol}`);

  const options = {
    url: stockEndpoint,
    qs: {
      api_token: apiToken,
      symbol: stockSymbol
    },
    json: true
  }
  global.setLogMessage(`Send API Request to ${options.url}`);

  request(options, (error, response, body) => {
    if(!error){
      if (error || response.statusCode >= 400) {
        callback(response.statusCode, {
          jobRunID: req.body.id,
          status: 'error',
          error: body,
          statusCode: response.statusCode == 200? 500: response.statusCode
        });
        global.setLogMessage(response, true);
      } else {
        callback(200, {
          jobRunID: req.body.id,
          data: body,
          statusCode: response.statusCode
        });
        global.setLogMessage(response);
      }
    }else{
      callback(500, {
        jobRunID: req.body.id,
        status: 'error',
        error: `API Call Failed: ${error}`,
        statusCode: 500
      });
      global.setLogMessage(`API Call to ${options.url} Failed!`, true);
      global.setLogMessage(response, true);
    }

  });
}

// This is a wrapper to allow the function to work with
// GCP Functions
exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data)
  })
}

// This is a wrapper to allow the function to work with
// AWS Lambda
exports.handler = (event, context, callback) => {
  createRequest(event, (statusCode, data) => {
    callback(null, data)
  })
}

// This is a wrapper to allow the function to work with
// newer AWS Lambda implementations
exports.handlerv2 = (event, context, callback) => {
  createRequest(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false
    })
  })
}

// This allows the function to be exported for testing
// or for running in express
module.exports.createRequest = createRequest
