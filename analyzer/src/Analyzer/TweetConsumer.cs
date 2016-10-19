using Analyzer.Model;
using System;
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
            consumer.Received += (ch, ea) =>
                            {
                                var messageBody = System.Text.Encoding.UTF8.GetString(ea.Body);
                                var tweet = JsonConvert.DeserializeObject<Tweet>(messageBody);
                                TweetRecieved?.Invoke(this, tweet);
                                
                                ((IModel) ch).BasicAck(ea.DeliveryTag, false);
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

        public event EventHandler<Tweet> TweetRecieved;
    }
}