import json

from lib import db, auth


def handler(event, context):

    email = auth.get_email(event['headers'], required=False)

    shortcode = event.get('pathParameters').get('shortcode')

    try:
        raffle = db.get_raffle(shortcode, email)
    except db.RaffleDoesNotExist:
        return {
          "statusCode": 404,
          "body": json.dumps({"message": "Raffle {} does not exist.".format(shortcode)})
        }
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
