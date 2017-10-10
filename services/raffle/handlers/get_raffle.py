import json
import logging

from lib import db, auth

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):

    try:
        email = auth.get_email(event['headers'], required=False)
    except auth.InvalidAuthentication as e:
        return {
            "statusCode": 401,
            "headers": {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : True
            },
            "body": json.dumps({"error": e.message })
        }

    shortcode = event.get('pathParameters').get('shortcode')

    try:
        raffle = db.get_raffle(shortcode, email)
    except db.RaffleDoesNotExist:
        return {
            "statusCode": 404,
            "headers": {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : True
            },
            "body": json.dumps({"message": "Raffle {} does not exist.".format(shortcode)})
        }
    except Exception as e:
        logger.exception(e)
        return {
            "statusCode": 503,
            "headers": {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : True
            },
            "body": json.dumps({"message": "Could not get raffle. Please try again."})
        }

    response = {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : True
        },
        "body": json.dumps(raffle)
    }

    return response
