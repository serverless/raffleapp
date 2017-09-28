import datetime
import os

import boto3
import dateutil.parser

from .utils import generate_shortcode

RAFFLE_TABLE_NAME = os.environ.get('RAFFLE_TABLE')
CLIENT = boto3.client('dynamodb')


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


def get_raffle(shortcode, client=CLIENT):
    raffle = {
        'shortcode': shortcode
    }
    resp = client.get_item(
        TableName=RAFFLE_TABLE_NAME,
        Key={
            'shortcode': {'S': shortcode}
        }
    )
    item = resp.get('Item')
    raffle['name'] = item.get('name').get('S')
    raffle['created_at'] = item.get('created_at').get('S')

    return raffle
