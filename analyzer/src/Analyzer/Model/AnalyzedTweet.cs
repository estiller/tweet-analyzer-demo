using Newtonsoft.Json;

namespace Analyzer.Model
{
    class AnalyzedTweet
    {
        [JsonProperty("id")]
        public string Id { get; set;}

        [JsonProperty("text")]
        public string Text { get; set; }

        [JsonProperty("sentiment")]
        public Sentiment Sentiment { get; set; }
    }
}