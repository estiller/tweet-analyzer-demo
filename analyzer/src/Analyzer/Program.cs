using System.Collections.Generic;
using Microsoft.Extensions.Configuration;

namespace Analyzer
{
    public static class Program
    {
        private const string RabbitMQHost = "rabbitmq";

        private static readonly Dictionary<string, string> DefaultConfig = new Dictionary<string, string>
        {
            {RabbitMQHost, "localhost"}
        };

        public static void Main(string[] args)
        {
            var configBuilder = new ConfigurationBuilder();
            configBuilder.AddInMemoryCollection(DefaultConfig);
            configBuilder.AddCommandLine(args);
            var configuration = configBuilder.Build();

            var tweetConsumer = new TweetConsumer(configuration[RabbitMQHost]);
            var tweetAnalyzer = new TweetAnalyzer();
            var tweetPublisher = new TweetPublisher(configuration[RabbitMQHost]);

            tweetConsumer.TweetRecieved += (sender, tweet) =>
            {
                var analyzedTweet = tweetAnalyzer.Analyze(tweet);
                tweetPublisher.PublishTweet(analyzedTweet);
            };            
            tweetConsumer.StartConsuming();
        }
    }
}
