using Analyzer.Model;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using System.Net.Http;
using System;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Analyzer
{
    class TweetAnalyzer
    {
        private readonly HttpClient _httpClient;

        public TweetAnalyzer(string apiKey)
        {
            if (!string.IsNullOrEmpty(apiKey))
            {
                _httpClient = new HttpClient
                {
                    BaseAddress = new Uri("https://westeurope.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment"),
                };
                _httpClient.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", apiKey);
                _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            }
        }

        public IEnumerable<AnalyzedTweet> AnalyzeTweets(IEnumerable<Tweet> tweets)
        {
            if (_httpClient == null)
            {
                return FakeAnalysis(tweets);
            }

            var request = new SentimentRequest
            {
                Documents = tweets.Distinct(new TweetEqualityComparer()).Select(tweet => new SentimentRequestDocument { Id = tweet.Id, Text = tweet.Text }).ToArray()
            };
            if (!request.Documents.Any())
            {
                return Enumerable.Empty<AnalyzedTweet>(); 
            }

            SentimentResponse response = GetAnalysisResponseAsync(request).GetAwaiter().GetResult();
            
            var lookup = request.Documents.ToDictionary(doc => doc.Id, doc => doc.Text);
            return response.Documents.Select(doc => new AnalyzedTweet
            {
                Id = doc.Id,
                Text = lookup[doc.Id],
                Sentiment = GetSentiment(doc.Score)
            });
        }

        private async Task<SentimentResponse> GetAnalysisResponseAsync(SentimentRequest request)
        {
            var content = new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8, "application/json");
            var httpResponse = await _httpClient.PostAsync("", content);
            var resposneString = await httpResponse.Content.ReadAsStringAsync();
            if (!httpResponse.IsSuccessStatusCode)
            {
                System.Console.WriteLine($"An error occured while getting analysis data: {httpResponse.ReasonPhrase}, {resposneString}");
                return new SentimentResponse { Documents = new SentimentResponseDocument[0] };
            }
            return JsonConvert.DeserializeObject<SentimentResponse>(resposneString);
        }

        private IEnumerable<AnalyzedTweet> FakeAnalysis(IEnumerable<Tweet> tweets)
        {
            var random = new System.Random();
            return tweets.Select(tweet => new AnalyzedTweet
            {
                Id = tweet.Id,
                Text = tweet.Text,
                Sentiment = GetSentiment(random.NextDouble())
            });
        }

        private Sentiment GetSentiment(double score)
        {
            if (score < 0.33)
                return Sentiment.Negative;
            if (score > 0.66)
                return Sentiment.Positive;
            return Sentiment.Neutral;
        }

        private class TweetEqualityComparer : IEqualityComparer<Tweet>
        {
            public bool Equals(Tweet x, Tweet y)
            {
                return x?.Id.Equals(y?.Id) ?? false;
            }

            public int GetHashCode(Tweet obj)
            {
                return obj.Id.GetHashCode();
            }
        }

        private class SentimentRequest
        {
            [JsonProperty("documents")]
            public SentimentRequestDocument[] Documents;
        }

        private class SentimentRequestDocument
        {
            [JsonProperty("id")]
            public string Id { get; set; }

            [JsonProperty("text")]
            public string Text { get; set; }
        }

        private class SentimentResponse
        {
            [JsonProperty("documents")]
            public SentimentResponseDocument[] Documents;
        }

        private class SentimentResponseDocument
        {
            [JsonProperty("id")]
            public string Id { get; set; }

            [JsonProperty("score")]
            public double Score { get; set; }
        }    }
}