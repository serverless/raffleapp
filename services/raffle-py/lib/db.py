import datetime
import os

import boto3

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
