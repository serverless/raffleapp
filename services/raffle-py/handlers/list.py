import json

from lib import db, auth


def handler(event, context):

    try:
        email= auth.get_email(event['headers'])
    except auth.MissingAuthentication:
        return {
          "statusCode": 401,
          "body": json.dumps({"error": "Please authorize with an Authorization header."})
        }

    if not auth.can_view_raffles(email):
        return {
          "statusCode": 403,
          "body": json.dumps({"error": "User not authorized to view all raffles."})
        }

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
