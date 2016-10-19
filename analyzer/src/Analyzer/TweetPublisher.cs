using Analyzer.Model;
using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Analyzer
{
    class TweetPublisher : QueueBase
    {
        private const string QueueName = "analyzed";

        public TweetPublisher(string hostName)
            : base(hostName, QueueName)
        {
        }

        public void PublishTweets(IEnumerable<AnalyzedTweet> tweets)
        {
            foreach (var tweet in tweets)
            {
                var serializedTweet = JsonConvert.SerializeObject(tweet);
                var encoded = System.Text.Encoding.UTF8.GetBytes(serializedTweet);
                Channel.BasicPublish(String.Empty, QueueName, false, null, encoded);

                Console.WriteLine($"Published: {serializedTweet}");
             }
       }
    }
}
