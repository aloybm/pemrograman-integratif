const mqtt = require('mqtt');

const client  = mqtt.connect('mqtt://localhost:1883');

client.on('connect', function () {
    console.log('Connected to MQTT broker.');

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readline.question('masuk/keluar: ', async function (topic) {
        readline.close();

        const cardId = await response('idkartu: ');
        const gateId = await response('idgate: ');

        const message = JSON.stringify({ idkartu: cardId, idgate: gateId });
        client.publish(topic, message, function(){
            console.log(`Message published to ${topic}: ${message}`);
            client.end(); 
        });
    });
});

function response(question) {
    return new Promise(resolve => {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        readline.question(question, answer => {
            readline.close();
            resolve(answer.trim());
        });
    });
}
