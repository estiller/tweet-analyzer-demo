import json
import pika
from twython import TwythonStreamer

class TwitterConfiguration:
    def __init__(self):
        with open('twitter_key.json') as jsonData:
            data = json.load(jsonData)

        self.consumer_key = data['consumer_key']
        self.consumer_secret = data['consumer_secret']
        self.access_token = data['access_token']
        self.access_token_secret = data['access_token_secret']


class MyStreamer(TwythonStreamer):
    def __init__(self, twitter_configuration):
        super().__init__(twitter_configuration.consumer_key, twitter_configuration.consumer_secret, twitter_configuration.access_token, twitter_configuration.access_token_secret)

    def on_success(self, data):
        if 'text' in data:
            output_data = {
                'text': data['text']
            }
            serialized_data = json.dumps(output_data)
            print(serialized_data)

    def on_error(self, status_code, data):
        print(status_code)


pika_connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
pika_channel = pika_connection.channel()
pika_channel.queue_declare(queue='tweets')

configuration = TwitterConfiguration()
while True:
    try:
        stream = MyStreamer(configuration)
        stream.statuses.filter(track='trump,clinton')
    except:
        print("Unexpected error: ", sys.exc_info()[0])