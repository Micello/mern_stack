// Create WebSocket connection to server
let ws;
ws = new WebSocket("ws://" + window.location.host + "/ws");

// WebSocket event listeners
ws.onopen = function () {
    console.log("WebSocket connection opened.");
};

ws.onmessage = function (event) {
    const data = JSON.parse(event.data);
    console.log("Message from server:", data);
    // Process messages from the server as needed
};

ws.onclose = function () {
    console.log("WebSocket connection closed.");
};

ws.onerror = function (error) {
    console.error("WebSocket error:", error);
};


/*
ws.send(JSON.stringify({ action: "pick_card", value: 2, player:"simo", clientId:"7799"}));
a
ws.send(JSON.stringify({ action: "startGame", value: 0, player:"simo", clientId:"7799"}));


*/
