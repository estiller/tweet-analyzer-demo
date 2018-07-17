import argparse
import json
import logging
import os
import pika
import time
import traceback
from twython import TwythonStreamer

class TwitterConfiguration:
    def __init__(self):
        self.consumer_key = os.environ['TwitterConsumerKey']
        self.consumer_secret = os.environ['TwitterConsumerSecret']
        self.access_token = os.environ['TwitterAccessToken']
        self.access_token_secret = os.environ['TwitterAccessTokenSecret']


class MyStreamer(TwythonStreamer):
    def __init__(self, twitter_configuration, pika_channel):
        super().__init__(twitter_configuration.consumer_key, twitter_configuration.consumer_secret, twitter_configuration.access_token, twitter_configuration.access_token_secret)
        self.pika_channel = pika_channel

    def on_success(self, data):
        if 'text' in data:
            output_data = {
                'id': data['id'],
                'text': data['text']
            }
            serialized_data = json.dumps(output_data)
            self.pika_channel.basic_publish('', 'tweets', serialized_data)
            print(serialized_data)
        return True

    def on_error(self, status_code, data):
         print(status_code)

    def on_timeout(self):
         print("Twitter Timeout")

    def disconnect(self):
         print("Twitter Disconnect")

parser = argparse.ArgumentParser(description='Read tweets and put them into a queue.')
parser.add_argument('--rabbitmq', '-r', dest='rabbitmq_host', default='localhost',
                    help='The hostname of the RabbitMQ host')
args = parser.parse_args()

connection = None
while connection == None:
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(args.rabbitmq_host))
    except pika.exceptions.ConnectionClosed:
        logging.warn("RabbitMQ connection still closed. Retrying.")
        connection = None
        time.sleep(5)
channel = connection.channel()
channel.queue_declare(queue='tweets')

configuration = TwitterConfiguration()
while True:
    try:
        stream = MyStreamer(configuration, channel)
        stream.statuses.filter(track='trump,putin')
    except:
        print("Unexpected error: ")        
        traceback.print_exc()
