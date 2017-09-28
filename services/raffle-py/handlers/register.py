import json

from lib import db


def handler(event, context):

    shortcode = event.get('pathParameters').get('shortcode')
    body = json.loads(event.get('body'))
    email = body.get('email')

    try:
        db.register_for_raffle(shortcode, email)
    except db.RaffleDoesNotExist:
        return {
          "statusCode": 404,
          "body": json.dumps({"message": "Raffle {} does not exist.".format(shortcode)})
        }
    except db.UserAlreadyRegistered:
        message = "{email} already registered for raffle {shortcode}".format(email=email, shortcode=shortcode)
        return {
          "statusCode": 409,
          "body": json.dumps({"message": message })
        }
    except Exception as e:
        print(e)
        return {
          "statusCode": 503,
          "body": json.dumps({"message": "Could not register for raffle. Please try again."})
        }

    response = {
        "statusCode": 200,
        "body": json.dumps({
            "shortcode": shortcode,
            "email": email
        })
    }

    return response
