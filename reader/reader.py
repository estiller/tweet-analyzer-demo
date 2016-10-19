import json
from twython import TwythonStreamer

class Configuration:
    def __init__(self):
        with open('twitter_key.json') as jsonData:
            data = json.load(jsonData)

        self.consumer_key = data["consumer_key"]
        self.consumer_secret = data["consumer_secret"]
        self.access_token = data["access_token"]
        self.access_token_secret = data["access_token_secret"]


class MyStreamer(TwythonStreamer):
    def on_success(self, data):
        if 'text' in data:
            print data['text'].encode('utf-8')

    def on_error(self, status_code, data):
        print status_code

configuration = Configuration()

stream = MyStreamer(configuration.consumer_key, configuration.consumer_secret, configuration.access_token, configuration.access_token_secret)
stream.statuses.filter(track='trump,clinton')