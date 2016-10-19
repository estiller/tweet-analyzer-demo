using Analyzer.Model;

namespace Analyzer
{
    class TweetAnalyzer
    {
        public AnalyzedTweet Analyze(Tweet tweet)
        {
            return new AnalyzedTweet
            {
                Id = tweet.Id,
                Text = tweet.Text,
                Sentiment = Sentiment.Neutral
            };
        }
    }
}