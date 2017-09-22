'use strict';

module.exports.register = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'User successfully registered for raffle with given shortcode.',
      input: event,
    }),
  };

  callback(null, response);
};
