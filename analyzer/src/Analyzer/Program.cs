using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Linq;
using Microsoft.Extensions.Configuration;

namespace Analyzer
{
    public static class Program
    {
        private const string RabbitMQHost = "rabbitmq";
        private const string ApiKey = "TextAnalyticsApiKey";

        private static readonly Dictionary<string, string> DefaultConfig = new Dictionary<string, string>
        {
            {RabbitMQHost, "localhost"}
        };

        public static void Main(string[] args)
        {
            var configBuilder = new ConfigurationBuilder();
            configBuilder.AddInMemoryCollection(DefaultConfig);
            configBuilder.AddEnvironmentVariables();
            configBuilder.AddCommandLine(args);
            var configuration = configBuilder.Build();

            var tweetConsumer = new TweetConsumer(configuration[RabbitMQHost]);
            var tweetAnalyzer = new TweetAnalyzer(configuration[ApiKey]);
            var tweetPublisher = new TweetPublisher(configuration[RabbitMQHost]);

            Observable.FromEventPattern<TweetRecievedEventArgs>(handler => tweetConsumer.TweetRecieved += handler, handler => tweetConsumer.TweetRecieved -= handler)
                .Select(pattern => pattern.EventArgs)
                .Buffer(TimeSpan.FromSeconds(0.5), 1000)
                .Select(recievedTweets => new { RecievedTweets = recievedTweets, Analyzed = tweetAnalyzer.AnalyzeTweets(recievedTweets.Select(recievedArgs => recievedArgs.Tweet))})
                .ForEachAsync(items => {
                    tweetPublisher.PublishTweets(items.Analyzed);
                    tweetConsumer.AckTweets(items.RecievedTweets.Select(item => item.TweetDeliveryTag));
                });
            tweetConsumer.StartConsuming();            
        }
    }
}
