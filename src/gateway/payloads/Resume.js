module.exports = (client) => {
    return {
        op: 6,
        d: {
            token: client.token,
            session_id: client.sessionId,
            seq: client.sequenceNumber
        }
    };
}