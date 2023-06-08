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

    // subscribe to topic 'my/test/topic'
    client.subscribe('my/test/topic', function (err) {
        if (err) {
            console.error('Error while subscribing:', err);
        } else {
            console.log('Subscribed to topic:', 'my/test/topic');
        }
    });
});

client.on('error', function (error) {
    console.log(error);
});

client.on('message', function (topic, message) {
    // called each time a message is received
    console.log('Received message:', topic, message.toString());
});
