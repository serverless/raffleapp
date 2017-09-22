'use strict';

module.exports.create = (event, context, callback) => {
  // generate shortcode
  var shortcode = generateShortCode();

  const response = {
    statusCode: 201,
    location: `/raffle/${shortcode}`,
    body: JSON.stringify({
      message: 'Created new raffle with shortcode: '+shortcode,
      shortcode: shortcode,
      input: event,
    }),
  };

  callback(null, response);
};

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

module.exports.show = (event, context, callback) => {

  var shortcode = event.pathParameters.shortcode

  console.log(`Shortcode recd. is: ${shortcode}`)

  // fetch raffle with specified shortcode and 'state=active'

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Showing details of raffle for given shortcode: '+shortcode,
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


// Move to lib later

function generateShortCode() {
  var firstPart = (Math.random() * 46656) | 0;
  var secondPart = (Math.random() * 46656) | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
}
