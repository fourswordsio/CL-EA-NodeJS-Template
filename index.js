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
  // Get stockSymbol Query String Parameter from GET Request or use Default Stock Symbols
  var stockSymbol = req.query.stockSymbols || defaultStockSymbols.join(',');
  console.log(`Stock Symbols to use: ${stockSymbol}`);

  const options = {
    url: stockEndpoint,
    qs: {
      api_token: apiToken,
      symbol: stockSymbol
    },
    json: true
  }
  request(options, (error, response, body) => {
    if(!error){
      if (error || response.statusCode >= 400) {
        callback({
          jobRunID: null /*input.id leaving as null for now*/,
          status: 'error',
          error: body,
          statusCode: response.statusCode == 200? 500: response.statusCode
        })
      } else {
        callback({
          jobRunID: null /*input.id leaving as null for now*/,
          data: body,
          statusCode: response.statusCode
        })
      }
    }else{
      callback({
        jobRunID: null,
        status: 'error',
        error: 'API Call Failed',
        statusCode: 500
      });
      console.error(error);
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
