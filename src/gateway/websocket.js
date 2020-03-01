const ws = require('ws');
const { getGatewayBot } = require('../util/Gateway');

module.exports = async (client) => {
    const gatewayUrl = await getGatewayBot(client.token);
    client.ws.gateway = {
        url: gatewayUrl,
        obtainedAt: Date.now()
    };

    const socket = new ws(`${gatewayUrl}/?v=7&encoding=json`);
    client.ws.socket = socket;
    
    socket.on('message', (incoming) => {
        const d = JSON.parse(incoming) || incoming;

        switch(d.op) {
            case 10: {
                client.ws.gateway.heartbeat = {
                    interval: d.d.heartbeat_interval,
                    last: null,
                    recieved: true
                };

                require('./heartbeat')(client);

                let payload;
                if (client.sessionId && client.sequenceNumber) {
                    payload = require('./payloads/Identify')(client);
                } else {
                    payload = require('./payloads/Resume')(client);
                }
                socket.send(JSON.stringify(payload));
                break;
            }
                
            case 11: {
                client.ws.gateway.heartbeat.last = Date.now();
                client.ws.gateway.heartbeat.recieved = true;
                break;
            }
            
            case 0: {
                client.sequenceNumber = d.s;
                const Events = require('../util/GatewayEvents');
                if (!Events.hasOwnProperty(d.t)) return;

                const e = require('./EventsHandler')[Events[d.t]];
                if (e) e(client, d);
                break;
            } 
        }
    });
}

