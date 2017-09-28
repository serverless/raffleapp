import json

from lib import db


def handler(event, context):

    shortcode = event.get('pathParameters').get('shortcode')

    try:
        raffle = db.get_raffle(shortcode)
    except Exception as e:
        print(e)
        return {
          "statusCode": 503,
          "body": json.dumps({"message": "Could not get raffle. Please try again."})
        }

    response = {
        "statusCode": 200,
        "body": json.dumps(raffle)
    }

    return response
