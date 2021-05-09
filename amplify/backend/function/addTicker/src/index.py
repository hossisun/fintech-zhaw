import json
import urllib3
from datetime import datetime
import boto3
import decimal
from botocore.exceptions import ClientError


def handler(event, context):

    # Make call to Finance Yahoo API to get stock data
    http = urllib3.PoolManager()
    baseUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/' + \
        event["ticker"]
    params = 'period1=' + event["startDate"] + \
        '&period2=' + event["endDate"] + '&interval=1d'
    queryUrl = baseUrl + "?" + params
    apiUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/TSLA?period1=1568782411&period2=1618178400&interval=1d'
    r = http.request('GET', queryUrl)
    data = json.loads(r.data)
    result = data["chart"]["result"][0]
    timestamps = result["timestamp"]

    prices = result["indicators"]["quote"][0]
    priceOpen = prices["open"]
    priceClose = prices["close"]
    priceLow = prices["low"]
    priceHigh = prices["high"]
    volumes = prices["volume"]
    dateConverted = [datetime.fromtimestamp(
        x).strftime("%Y-%m-%d") for x in timestamps]

    stockPrices = [{'date': date, 'open': decimal.Decimal(openPrice), 'close': decimal.Decimal(closePrice), 'low': decimal.Decimal(lowPrice), 'high': decimal.Decimal(highPrice), 'volume': volume}
                   for date, openPrice, closePrice, lowPrice, highPrice, volume in zip(dateConverted, priceOpen, priceClose, priceLow, priceHigh, volumes)]

    stock = {
        "id": result["meta"]["symbol"],
        "ticker": result["meta"]["symbol"],
        "currency": result["meta"]["currency"],
        "exchangeName": result["meta"]["exchangeName"],
        "prices": stockPrices
    }

    dynamodb = boto3.resource('dynamodb')
    response = {}

    try:
        table = dynamodb.Table('Tickers')
        response = table.put_item(
            Item=stock,
            ConditionExpression="attribute_not_exists(ticker)",
            ReturnValues="ALL_OLD"
        )
    except ClientError as e:
        # If ConditionalCheckFailedException, then data entry already exists
        # --> stock data update should be executed
        if e.response['Error']['Code'] != 'ConditionalCheckFailedException':
            response = {"message": "an error occured"}
            raise
        else:
            response = updateTicker(result["meta"]["symbol"], stockPrices)

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps(response)
    }


def updateTicker(ticker, stockPrices):
    """
    Update prices in table if ticker already exists
    TODO update only missing prices
    """
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Tickers')

    response = table.update_item(
        Key={'ticker': ticker},
        UpdateExpression="set prices=:p",
        ExpressionAttributeValues={
            ':p': stockPrices
        },
        ReturnValues="UPDATED_NEW"
    )
    return response


def default(obj):
    """
    JSON Decimal deserializer
    """
    if isinstance(obj, decimal.Decimal):
        return str(obj)
    raise TypeError("Object of type '%s' is not JSON serializable" %
                    type(obj).__name__)
