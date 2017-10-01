'use strict';

module.exports.list = (event, context, callback) => {
  // fetch all records from db

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Listing all active raffles.',
      input: event,
    }),
  };

  callback(null, response);
};

module.exports.start = (event, context, callback) => {

  var shortcode = event.pathParameters.shortcode
  
  console.log(`Shortcode recd. is: ${shortcode}`)
  
  // update 'state=active' raffle with specified shortcode

  const response = {
    statusCode: 204,
    body: JSON.stringify({
      message: 'Starting raffle for given shortcode: '+ shortcode +' and picking a winner.',
      input: event,
    }),
  };

  callback(null, response);
};

module.exports.stop = (event, context, callback) => {

  var shortcode = event.pathParameters.shortcode
  
  console.log(`Shortcode recd. is: ${shortcode}`)
  
  // update 'state=inactive' raffle with specified shortcode

  const response = {
    statusCode: 204,
    body: JSON.stringify({
      message: 'Stopping raffle for given shortcode: '+shortcode,
      input: event,
    }),
  };

  callback(null, response);
};
