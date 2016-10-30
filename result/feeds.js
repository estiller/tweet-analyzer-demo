var sentiment = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam accumsan diam vel dui posuere tristique. Curabitur et augue dolor. Praesent ut neque vel ex aliquam tristique. ";
exports.feeds = [
    {
        id: 1,
        text: "Amy : " + sentiment,
        sentiment: -1,
        topic: "trump",
        aggregateSentiment: 30
    },
    {
        id: 2,
        text: "Scott : " + sentiment,
        topic: "trump",
        sentiment: -1,
        aggregateSentiment: 31
    },
    {
        id: 3,
        text: "Paul : " + sentiment,
        topic: "trump",
        sentiment: 1,
        aggregateSentiment: 21
    },
    {
        id: 4,
        text: "Andrew : " + sentiment,
        topic: "clinton",
        sentiment: 1,
        aggregateSentiment: 31,
    },
    {
        id: 5,
        text: "Jonathan : " + sentiment,
        topic: "clinton",
        sentiment: 1,
        aggregateSentiment: 32
    },
    {
        id: 6,
        text: "Adam",
        topic: "clinton" + sentiment,
        sentiment: -1,
        aggregateSentiment: 26
    },
    {
        id: 7,
        text: "Barbara : " + sentiment,
        topic: "clinton",
        sentiment: -1,
        aggregateSentiment: 27,
    },
    {
        id: 8,
        text: "Bob : " + sentiment,
        topic: "trump",
        sentiment: 1,
        aggregateSentiment: 22
    }
];