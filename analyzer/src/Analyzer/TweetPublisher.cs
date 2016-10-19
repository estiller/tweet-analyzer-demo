using Analyzer.Model;
using System;
using Newtonsoft.Json;
using RabbitMQ.Client;

namespace Analyzer
{
    class TweetPublisher : QueueBase
    {
        private const string QueueName = "analyzed";

        public TweetPublisher(string hostName)
            : base(hostName, QueueName)
        {
        }

        public void PublishTweet(AnalyzedTweet tweet)
        {
            var serializedTweet = JsonConvert.SerializeObject(tweet);
            var encoded = System.Text.Encoding.UTF8.GetBytes(serializedTweet);
            Channel.BasicPublish(String.Empty, QueueName, false, null, encoded);

            Console.WriteLine($"Published: {serializedTweet}");
        }
    }
}
