const p = require('phin').promisified;

module.exports = async (client) => {
    // TODO: Don't terminate
    if (client.ws.gateway.heartbeat.recieved == false) {
        client.emit('disconnect');
        client.ws.socket.close(999, `Last heartbeat hasn't been acknowledged, terminating connection`);
        
        // reconnect
        require('./websocket')(client);
    }

    setInterval(() => {
        client.ws.socket.send(JSON.stringify({
            op: 1,
            d: 0
        }));

        client.ws.gateway.heartbeat.recieved = false;
    }, client.ws.gateway.heartbeat.interval);
}