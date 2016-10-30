var express = require('express');
var yargs = require('yargs').argv;
var os = require("os");
var hostname = os.hostname();

// var feeds = require('./feeds.js')

app = express(),
  server = require('http').Server(app),
  io = require('socket.io')(server);

io.set('transports', ['polling']);

var port = yargs.port || process.env.PORT || 4000;

io.sockets.on('connection', function (socket) {
  console.log("connection added");

  socket.on('disconnect', function (data) {
    console.log("connection removed");
  })
});





function createFeeds() {
  var sentiment = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam accumsan diam vel dui posuere tristique. Curabitur et augue dolor. Praesent ut neque vel ex aliquam tristique. ";

  return [
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
};

function getFeeds() {
  var index = 0;
  var feeds = createFeeds();
  setInterval(function () {
    if (index >= feeds.length) {
      index = 0;
    }
    var feed = feeds[index];
    index++;
    io.sockets.emit("newFeed", feed);
    console.log("new feed added: " + JSON.stringify(feed));
  }, 1000);
}

getFeeds();

function getTopics() {
  return [
    {
      topic: 'trump',
      img: 'http://static4.businessinsider.com/image/56c640526e97c625048b822a-480/donald-trump.jpg',
    },
    {
      topic: 'clinton',
      img: 'https://lh4.googleusercontent.com/-eXKU4UhFusI/AAAAAAAAAAI/AAAAAAAAATA/1QahWqsqd-I/s0-c-k-no-ns/photo.jpg'
    }
  ]
}

app.use(express.static(__dirname + '/app'));

app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/app/index.html'));
});
app.get('/topics', function (req, res) {
  res.json(getTopics());
});
app.get('/hostName',function(req,res){
  res.json(hostname);
})

server.listen(port, function () {
  var port = server.address().port;
  console.log('App running on port ' + port);
});

