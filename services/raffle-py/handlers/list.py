import json

from lib import db


def handler(event, context):

    try:
        raffles = db.get_raffles()
    except Exception as e:
        print(e)
        return {
          "statusCode": 503,
          "body": json.dumps({"message": "Could not get raffles. Please try again."})
        }

    response = {
        "statusCode": 200,
        "body": json.dumps(raffles)
    }

    return response
