using Newtonsoft.Json;

namespace Analyzer.Model
{
    class Tweet
    {
        [JsonProperty("id")]
        public string Id { get; set;}
        
        [JsonProperty("text")]
        public string Text { get; set; }
    }
}