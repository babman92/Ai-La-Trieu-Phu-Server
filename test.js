var ip = require('ip').address();
var port = process.env.PORT || 5000;
var redis = require("redis"),
    client = redis.createClient(port, ip);

client.on("error", function (err) {
    console.log("Error " + err);
});
client.set('name', 'Hello Redis', client.print);

client.get('name', function (err, reply) {
    if (err) { throw err; }
    console.log();
    console.log('=============================================');
    console.log(reply);
    console.log('=============================================');
});