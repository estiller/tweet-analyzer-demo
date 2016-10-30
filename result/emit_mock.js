#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var yargs = require('yargs').argv;
var config = require('./server.config');

var rabbitMQName = yargs.queue || config.rabbitMQDefault;
var rabbitMQServer = yargs.qserver || config.rabbitMQServer;


function getFeeds(ch) {
  var index = 0;
  var feeds = require('./feeds.js').feeds;

  setInterval(function () {
    if (index >= feeds.length) {
      index = 0;
    }
    var feed = feeds[index];
    index++;
    ch.assertExchange(rabbitMQName, 'fanout', { durable: false });
    ch.publish(rabbitMQName, '', new Buffer(JSON.stringify(feed)));
    console.log(" [x] Sent %s", JSON.stringify(feed));
  }, 1000);
};


amqp.connect(rabbitMQServer, function (err, conn) {
  conn.createChannel(function (err, ch) {
    getFeeds(ch);
  });
});