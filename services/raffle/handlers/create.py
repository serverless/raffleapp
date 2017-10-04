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

    if not auth.can_create_raffle(email):
        return {
            "statusCode": 403,
            "headers": {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : True
            },
            "body": json.dumps({"error": "User not authorized to to create a raffle."})
        }

    body = json.loads(event.get('body'))
    name = body.get('name')
    description = body.get('description')

    if not name:
        return {
            "statusCode": 400,
            "headers": {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : True
            },
            "body": json.dumps({"error": "Request body must include a 'name' key"})
        }
    if not description:
        return {
            "statusCode": 400,
            "headers": {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : True
            },
            "body": json.dumps({"error": "Request body must include a 'description' key"})
        }

    admins = body.get('admins', [])

    try:
        shortcode = db.create_raffle(name, description, admins)
    except Exception as e:
        logger.exception(e)
        return {
            "statusCode": 503,
            "headers": {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : True
            },
            "body": json.dumps({"message": "Could not create raffle. Please try again."})
        }

    response = {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : True
        },
        "body": json.dumps({
            'shortcode': shortcode,
            'name': name,
            'description': description
        })
    }

    return response
