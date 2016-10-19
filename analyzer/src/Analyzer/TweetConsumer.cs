using Analyzer.Model;
using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace Analyzer
{
    class TweetConsumer : QueueBase
    {
        private const string QueueName = "tweets";

        private string _consumerTag;

        public TweetConsumer(string hostName)
            : base(hostName, QueueName)
        {
        }

        public void StartConsuming()
        {
            if (_consumerTag != null)
                throw new InvalidOperationException();

            var consumer = new EventingBasicConsumer(Channel);
            consumer.Received += (sender, ea) =>
                            {
                                var messageBody = System.Text.Encoding.UTF8.GetString(ea.Body);
                                var tweet = JsonConvert.DeserializeObject<Tweet>(messageBody);
                                TweetRecieved?.Invoke(this, new TweetRecievedEventArgs
                                {
                                    Tweet = tweet,
                                    TweetDeliveryTag = ea.DeliveryTag
                                });
                            };
            _consumerTag = Channel.BasicConsume(QueueName, false, consumer);
        }

        public void StopConsuming()
        {
            if (_consumerTag == null)
                throw new InvalidOperationException();

            Channel.BasicCancel(_consumerTag);
            _consumerTag = null;
        }

        public void AckTweets(IEnumerable<ulong> deliveryTags)
        {
            foreach (var deliveryTag in deliveryTags)
            {
                Channel.BasicAck(deliveryTag, false);
            }
        }

        public event EventHandler<TweetRecievedEventArgs> TweetRecieved;
    }
}