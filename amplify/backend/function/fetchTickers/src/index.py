import json
import datetime
import boto3
import decimal


def handler(event, context):

    dynamodb = boto3.resource('dynamodb')
    response = listTickers(dynamodb)

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
            "Content-Type": "application/json"
        },
        'body': json.dumps(response, default=default)
    }


def default(obj):
    """
    JSON Decimal deserializer
    """
    if isinstance(obj, decimal.Decimal):
        return str(obj)
    raise TypeError("Object of type '%s' is not JSON serializable" %
                    type(obj).__name__)


def listTickers(dynamodb):
    """
    Return all stocks
    """

    tickers = dynamodb.Table('Tickers')
    response = tickers.scan()
    return response['Items']
