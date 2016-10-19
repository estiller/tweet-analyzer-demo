using Analyzer.Model;
using System.Collections.Generic;
using System.Linq;

namespace Analyzer
{
    class TweetAnalyzer
    {
        public IEnumerable<AnalyzedTweet> AnalyzeTweets(IEnumerable<Tweet> tweets)
        {
            return tweets.Select(tweet => new AnalyzedTweet
            {
                Id = tweet.Id,
                Text = tweet.Text,
                Sentiment = Sentiment.Neutral
            });
        }
    }
}