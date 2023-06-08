var mqtt = require('mqtt');

var options = {
    host: '96d6ccb0002742eeb82f3a9b15a7ed8f.s2.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'rxpkisoviet',
    password: 'KhontoRU26'
}

// initialize the MQTT client
var client = mqtt.connect(options);

// setup the callbacks
client.on('connect', function () {
    console.log('Connected');

    // publish message 'Hello' to topic 'my/test/topic'
    client.publish('my/test/topic', 'Hello', function (err) {
        if (err) {
            console.error('Error while publishing:', err);
        } else {
            console.log('Message published:', 'Hello');
            client.end(); // Disconnect the client after publishing
        }
    });
});

client.on('error', function (error) {
    console.log(error);
});
