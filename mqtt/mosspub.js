const mqtt = require('mqtt');

const client  = mqtt.connect('mqtt://localhost:1883');

client.on('connect', function () {
    console.log('Connected to MQTT broker.');

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readline.request('masuk/keluar: ', async function (topic) {
        readline.close();

        const cardId = await response('idkartu: ');
        const gateId = await response('idkartu: ');


        const message = JSON.stringify({ idkartu: cardId, idgate: gateId });
        client.publish(topic, message, function(){
            console.log(`Message published to ${topic}: ${message}`);
            client.end();   
        });
    });
});

function response(request) {
    return new Promise(resolve => {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        readline.request(response, answer => {
            readline.close();
            resolve(answer.trim());
        });
    });
}
