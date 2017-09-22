'use strict';

module.exports.register = (event, context, callback) => {

  var shortcode = event.pathParameters.shortcode
  
  console.log(`Shortcode recd. is: ${shortcode}`)

  // add user to the db against the shortcode
    
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'User successfully registered for raffle with shortcode.'+shortcode,
      input: event,
    }),
  };

  callback(null, response);
};
