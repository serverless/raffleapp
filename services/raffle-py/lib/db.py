from botocore.exceptions import ClientError
import datetime
import os

import boto3
import dateutil.parser

from .auth import is_raffle_admin
from .utils import generate_shortcode

RAFFLE_TABLE_NAME = os.environ.get('RAFFLE_TABLE')
ENTRY_TABLE_NAME = os.environ.get('ENTRY_TABLE')
CLIENT = boto3.client('dynamodb')


class RaffleDoesNotExist(Exception):
    pass

class UserAlreadyRegistered(Exception):
    pass


def create_raffle(name, admins, client=CLIENT):
    shortcode = generate_shortcode()
    dt = datetime.datetime.now().isoformat()

    resp = client.put_item(
        TableName=RAFFLE_TABLE_NAME,
        Item={
            'shortcode': {'S': shortcode},
            'name': {'S': name},
            'created_at': {'S': dt},
            'admins': {'SS': admins}
        },
        # Don't want to overwrite an existing raffle if same shortcode is generated.
        ConditionExpression="attribute_not_exists(shortcode)",
    )

    return shortcode


def clean_item(item):
    return {
      'created_at': item.get('created_at').get('S'),
      'name': item.get('name').get('S'),
      'shortcode': item.get('shortcode').get('S'),
    }


def get_timestamp(item):
    return dateutil.parser.parse(item.get('created_at'))


def get_raffles(limit=10, client=CLIENT):
    resp = client.scan(
        TableName=RAFFLE_TABLE_NAME
    )
    items = resp.get('Items')
    cleaned = [clean_item(item) for item in items]
    sorted_items = sorted(cleaned, reverse=True, key=get_timestamp)

    return sorted_items[:limit]


def get_raffle(shortcode, email, client=CLIENT):
    raffle = {
        'shortcode': shortcode,
        'admin': False,
    }
    resp = client.get_item(
        TableName=RAFFLE_TABLE_NAME,
        Key={
            'shortcode': {'S': shortcode}
        }
    )
    item = resp.get('Item')

    if not item:
        raise RaffleDoesNotExist()

    admins = item.get('admins', {}).get('SS')

    if is_raffle_admin(email, admins):
        raffle['admin'] = True

    raffle['name'] = item.get('name').get('S')
    raffle['created_at'] = item.get('created_at').get('S')
    raffle['registered'] = False

    if email:
        resp = client.get_item(
            TableName=ENTRY_TABLE_NAME,
            Key={
                'shortcode': {'S': shortcode},
                'email': {'S': email},
            }
        )
        if resp.get('Item'):
            raffle['registered'] = True

    return raffle


def register_for_raffle(shortcode, email, client=CLIENT):
    dt = datetime.datetime.now().isoformat()

    resp = client.get_item(
        TableName=RAFFLE_TABLE_NAME,
        Key={
            'shortcode': {'S': shortcode}
        }
    )

    if not resp.get('Item'):
        raise RaffleDoesNotExist()

    try:
        resp = client.put_item(
            TableName=ENTRY_TABLE_NAME,
            Item={
                'shortcode': {'S': shortcode},
                'email': {'S': email},
                'registered_at': {'S': dt},
            },
            # Don't want to overwrite an existing raffle if same shortcode is generated.
            ConditionExpression="attribute_not_exists(email)",
        )
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            raise UserAlreadyRegistered()
        raise e
