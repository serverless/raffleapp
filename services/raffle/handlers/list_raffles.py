import json
import logging

from lib import db, auth

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):

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
    except auth.InvalidAuthentication as e:
        return {
            "statusCode": 401,
            "headers": {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : True
            },
            "body": json.dumps({"error": e.message })
        }

    if not auth.can_view_raffles(email):
        return {
            "statusCode": 403,
            "headers": {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : True
            },
            "body": json.dumps({"error": "User not authorized to view all raffles."})
        }

    try:
        raffles = db.get_raffles()
    except Exception as e:
        logger.exception(e)
        return {
            "statusCode": 503,
            "headers": {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : True
            },
            "body": json.dumps({"message": "Could not get raffles. Please try again."})
        }

    response = {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : True
        },
        "body": json.dumps(raffles)
    }

    return response
