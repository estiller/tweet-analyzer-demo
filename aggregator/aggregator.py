import argparse
import json
import logging
import pika
import re
import time
from redis import Redis

topics = [ 'trump', 'putin' ]

parser = argparse.ArgumentParser(description='Aggregate analysis performed by the analyzer.')
parser.add_argument('--rabbitmq', '-r', dest='rabbitmq_host', default='localhost',
                    help='The hostname of the RabbitMQ host')
parser.add_argument('--redis', '-d', dest='redis_host', default='localhost',
                    help='The hostname of the Redis host')
args = parser.parse_args()

connection = None
while connection == None:
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(args.rabbitmq_host))
    except pika.exceptions.ConnectionClosed:
        logging.warn("RabbitMQ connection still closed. Retrying.")
        time.sleep(5)
channel = connection.channel()
channel.queue_declare(queue='analyzed')
channel.exchange_declare(exchange='output', type='fanout')

redis = Redis(host=args.redis_host, db=0, socket_timeout=5)

def callback(ch, method, properties, body):
    bodyString = body.decode('utf-8')
    print("Received '{}'".format(bodyString))
    data = json.loads(bodyString)
    for topic in topics:
        if re.search(topic, bodyString, re.IGNORECASE):
            counter = redis.incr("{}-{}".format(topic, data['sentiment']))
            output = {
                'id': data['id'],
                'text': data['text'],
                'topic': topic,
                'sentiment': data['sentiment'],
                'aggregateSentiment': counter
            }
            outputString = json.dumps(output)
            channel.basic_publish('output', '', outputString)
            print("Output '{}'".format(outputString))
    channel.basic_ack(method.delivery_tag)

channel.basic_consume(callback, queue='analyzed')
channel.start_consuming()