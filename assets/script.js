const socket = new WebSocket("ws://192.168.42.14:8082");

// When the connection is open
socket.onopen = function(event) {
    // console.log("Connected to WebSocket server.");
};

// When a message is received from the server
socket.onmessage = function(event) {
    // console.log("Message from server:", event.data);
    // Handle the received message (e.g., update the UI)
};

// When the connection is closed
socket.onclose = function(event) {
    // console.log("WebSocket connection closed.");
};

// When there is an error
socket.onerror = function(event) {
    console.error("WebSocket error:", event);
};

// Function to send a message to the WebSocket server
function sendMessageToServer(message) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
    } else {
        // console.log("WebSocket is not open.");
    }
}
