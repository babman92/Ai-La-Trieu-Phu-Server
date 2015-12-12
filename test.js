var redis = require("redis"),
    client = redis.createClient(process.env.REDIS_URL);

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