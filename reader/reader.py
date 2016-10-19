import configparser
import json
import pika
import sys
import time
from twython import TwythonStreamer

class TwitterConfiguration:
    def __init__(self):
        config_parser = configparser.ConfigParser()
        config_parser.read('config.ini')
        twitter_section = config_parser['Twitter']

        self.consumer_key = twitter_section['ConsumerKey']
        self.consumer_secret = twitter_section['ConsumerSecret']
        self.access_token = twitter_section['AccessToken']
        self.access_token_secret = twitter_section['AccessTokenSecret']


class MyStreamer(TwythonStreamer):
    def __init__(self, twitter_configuration, pika_channel):
        super().__init__(twitter_configuration.consumer_key, twitter_configuration.consumer_secret, twitter_configuration.access_token, twitter_configuration.access_token_secret)
        self.pika_channel = pika_channel

    def on_success(self, data):
        if 'text' in data:
            output_data = {
                'text': data['text']
            }
            serialized_data = json.dumps(output_data)
            self.pika_channel.basic_publish('', 'tweets', serialized_data)
            print(serialized_data)

    def on_error(self, status_code, data):
        print(status_code)


connection = None
while connection == None:
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
    except pika.exceptions.ConnectionClosed:
        print("RabbitMQ connection still closed. Retrying.")
        time.sleep(5)
channel = connection.channel()
channel.queue_declare(queue='tweets')

configuration = TwitterConfiguration()
while True:
    try:
        stream = MyStreamer(configuration, channel)
        stream.statuses.filter(track='trump,clinton')
    except:
        print("Unexpected error: ", sys.exc_info()[0])