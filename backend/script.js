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
ws.send(JSON.stringify({ action: "pick_card", value: 2, suit: "Spade", player:"simo"}));

ws.send(JSON.stringify({ action: "startGame", value: 2, suit: "cpu", player:"simo", clientId:"7799"}));


*/
