const WebSocket = require("ws");

const ws = new WebSocket("ws://localhost:8080");

ws.on("open", () => {
    const channel = process.argv[2];

    if (channel && (channel === "ENE3" || channel === "MOB1")) {
        setInterval(() => {
            const price = (Math.random() * 100).toFixed(2);
            ws.send(JSON.stringify({ type: "publish", channel: channel, price: price }));
            console.log(`Published ${channel}: ${price}`);
        }, 5000);
    } else {
        console.log("Please provide a valid channel (ENE3 or MOB1).");
    }
});

ws.on("error", (error) => {
    console.log(`Connection error: ${error}`);
    rl.close();
});
