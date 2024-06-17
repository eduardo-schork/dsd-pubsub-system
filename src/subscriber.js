const WebSocket = require("ws");

const ws = new WebSocket("ws://localhost:8080");

ws.on("open", () => {
    const channel = process.argv[2];
    if (channel) {
        ws.send(JSON.stringify({ type: "subscribe", channel: channel }));
        console.log(`Subscribed to channel: ${channel}`);
    } else {
        console.log("Please provide a channel to subscribe to.");
    }
});

ws.on("message", (message) => {
    const data = JSON.parse(message);

    if (data?.message?.includes("Subscribed")) {
        return;
    }

    console.log(`Received update for ${data.channel}: ${data.price}`);
});
