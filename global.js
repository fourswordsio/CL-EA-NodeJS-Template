/*
Import .env config
Accepted Parameters:
#Express App Port
PORT=<INSERT WEB SERVER PORT>
#api.worldtradingdata.com API KEY
API_KEY=<INSERT API KEY>
*/
require('dotenv').config();

//Setup Logger
var log4js = require('log4js');
log4js.configure({
  appenders: {
    runtime: { type: 'file', filename: 'logs/adaptor.log' }
  },
  categories: { default: { appenders: ['runtime'], level: 'info'} }
});
const logger = log4js.getLogger('runtime'); 

function setLogMessage(message, error){
    if(!error){
      console.log(message);
      logger.info(message);
    }else{
      console.error(message);
      logger.error(message);
    }
  }

module.exports.logger = logger;
module.exports.setLogMessage = setLogMessage;