import json
import logging

from lib import db, auth

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):

    shortcode = event.get('pathParameters').get('shortcode')
    body = json.loads(event['body'])
    winner = body.get('winner')

    if not winner:
        return {
            "statusCode": 400,
            "headers": {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : True
            },
            "body": json.dumps({"error": "Request body must include a 'winner' key"})
        }

    try:
        email= auth.get_email(event['headers'])
    except auth.MissingAuthentication:
        return {
            "statusCode": 401,
            "headers": {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : True
            },
            "body": json.dumps({"error": "Please authorize with an Authorization header."})
        }

    try:
        db.set_winner_for_raffle(shortcode, email, winner)
    except db.RaffleDoesNotExist:
        return {
            "statusCode": 404,
            "headers": {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : True
            },
            "body": json.dumps({"message": "Raffle {} does not exist.".format(shortcode)})
        }
    except db.RaffleHasWinner:
        return {
            "statusCode": 409,
            "headers": {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : True
            },
            "body": json.dumps({"message": "Raffle {} already has a winner.".format(shortcode)})
        }
    except auth.InvalidAuthentication as e:
        return {
            "statusCode": 401,
            "headers": {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : True
            },
            "body": json.dumps({"error": e.message })
        }
    except Exception as e:
        logger.exception(e)
        return {
            "statusCode": 503,
            "headers": {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : True
            },
            "body": json.dumps({"message": "Could not set raffle winner. Please try again."})
        }

    response = {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : True
        },
        "body": json.dumps({
            "shortcode": shortcode,
            "winner": winner
        })
    }

    return response
