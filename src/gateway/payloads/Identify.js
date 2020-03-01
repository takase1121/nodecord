module.exports = client => {
    return {
        op: 2,
        d: {
            token: client.token,
            properties: {
                $os: process.platform,
                $browser: "nodecord",
                $device: "nodecord"
            },
            compress: false,
            large_threshold: 250,
            presence: {
                status: "online",
                afk: false
            }
        }
    };
};
