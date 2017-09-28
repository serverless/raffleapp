const awsSDK = require('aws-sdk');
const { generateShortCode } = require('../utils');

const documentClient = new awsSDK.DynamoDB.DocumentClient();
const RAFFLE_TABLE = process.env.RAFFLE_TABLE;

module.exports.handler = (event, context, callback) => {
  const body = JSON.parse(event.body);
  const name = body.name;
  const admins = body.admins ? body.admins : [];
  const timestamp = new Date().getTime();

  const shortcode = generateShortCode();
  const params = {
    TableName: RAFFLE_TABLE,
    Item: {
      shortcode,
      name,
      timestamp,
      admins: documentClient.createSet(admins),
    },
    Expected: {
      shortcode: {
        // We don't want to overwrite an existing shortcode
        Exists: false,
      },
    },
  };

  documentClient.put(params, function(error, data) {
    if (error) {
      console.log(error);
      const response = {
        statusCode: 503,
        body: JSON.stringify({
          message: 'Could not create raffle. Please try again',
        }),
      };
      callback(null, response);
    } else {
      const response = {
        statusCode: 201,
        body: JSON.stringify({
          shortcode,
          name,
        }),
      }
      callback(null, response);
    }
  });
};
