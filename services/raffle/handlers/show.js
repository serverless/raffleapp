const awsSDK = require('aws-sdk');

const documentClient = new awsSDK.DynamoDB.DocumentClient();
const RAFFLE_TABLE = process.env.RAFFLE_TABLE;

module.exports.handler = (event, context, callback) => {

    const shortcode = event.pathParameters.shortcode;

    console.log(JSON.stringify(event));

    // fetch raffle with specified shortcode and 'state=active'
    var params = {
        TableName: RAFFLE_TABLE,
        Key:{
            "shortcode": shortcode
        }
    };
    
    documentClient.get(params, function(error, data) {
        if (error) {
            console.log(error);
            const response = {
                statusCode: 503,
                body: JSON.stringify({
                    message: `Error in getting raffle for shortcode ${shortcode}`,
                }),
            };
            callback(null, response);
        } else {
            // no matching record
            if (!data.Item) { 
                const response = {
                    statusCode: 404,
                    body: JSON.stringify({
                        message: `No raffle found for shortcode ${shortcode}`,
                    }),
                }
                callback(null, response);
            } else {
                const response = {
                    statusCode: 200,
                    body: JSON.stringify({
                        data,
                    }),
                }
                callback(null, response);
            }
        }
    });    
};
  