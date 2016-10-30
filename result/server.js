var express = require('express');
async = require('async');
var yargs = require('yargs').argv;

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





// async.retry(
//   { times: 10, interval: 750 },
//   function (callback) {
//     pg.connect('postgres://postgres@db/postgres', function (err, client, done) {
//       if (err) {
//         console.error("Waiting for db");
//       }
//       callback(err, client);
//     });
//   },
//   function (err, client) {
//     if (err) {
//       return console.err("Giving up");
//     }
//     console.log("Connected to db");
//     getFeed(client);
//   }
// );



function createFeeds() {
  var sentiment = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam accumsan diam vel dui posuere tristique. Curabitur et augue dolor. Praesent ut neque vel ex aliquam tristique. ";

  return [
    {
      id: 1,
      text: "text",
      topic: "trump",
      sentiment: sentiment,
      aggregateSentiment: -1
    },
    {
      id: 2,
      text: "text",
      topic: "trump",
      sentiment: sentiment,
      aggregateSentiment: 0
    },
    {
      id: 3,
      text: "text",
      topic: "trump",
      sentiment: sentiment,
      aggregateSentiment: 1
    },
    {
      id: 4,
      text: "text",
      topic: "clinton",
      sentiment: sentiment,
      aggregateSentiment: -1
    },
    {
      id: 5,
      text: "text",
      topic: "clinton",
      sentiment: sentiment,
      aggregateSentiment: 0
    },
    {
      id: 6,
      text: "text",
      topic: "clinton",
      sentiment: sentiment,
      aggregateSentiment: 1
    },
    {
      id: 7,
      text: "text",
      topic: "clinton",
      sentiment: sentiment,
      aggregateSentiment: 1
    },
    {
      id: 8,
      text: "text",
      topic: "trump",
      sentiment: sentiment,
      aggregateSentiment: -1
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
})

server.listen(port, function () {
  var port = server.address().port;
  console.log('App running on port ' + port);
});

