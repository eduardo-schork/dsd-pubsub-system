const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080, host: "localhost" });

const subscribers = {
    ENE3: [],
    MOB1: [],
};

wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        const data = JSON.parse(message);

        console.log(`Received message: ${message}`);

        const hasChannel = subscribers[data.channel];

        switch (data.type) {
            case "subscribe":
                if (hasChannel) {
                    hasChannel.push(ws);
                    ws.send(JSON.stringify({ message: `Subscribed to ${data.channel}` }));
                    console.log(`Subscriber added to channel: ${data.channel}`);
                } else {
                    ws.send(JSON.stringify({ error: `Channel ${data.channel} does not exist` }));
                    console.log(`Error: Channel ${data.channel} does not exist`);
                }
                break;

            case "publish":
                if (subscribers[data.channel]) {
                    subscribers[data.channel].forEach((subscriber) => {
                        if (subscriber.readyState === WebSocket.OPEN) {
                            subscriber.send(
                                JSON.stringify({ channel: data.channel, price: data.price })
                            );
                            console.log(
                                `Replicating message to subscriber in channel: ${data.channel}`
                            );
                        }
                    });
                    console.log(
                        `Message published to channel: ${data.channel}, Price: ${data.price}`
                    );
                }
                break;
        }
        console.log("============================================");
    });

    ws.on("close", () => {
        for (const channel in subscribers) {
            subscribers[channel] = subscribers[channel].filter((subscriber) => subscriber !== ws);
            console.log(`Subscriber removed from channel: ${channel}`);
            console.log("============================================");
        }
    });
});

console.log("Broker running on ws://localhost:8080");
