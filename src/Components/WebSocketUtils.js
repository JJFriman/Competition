// WebSocketUtils is sending the groupData 

let socket;

export function initializeWebSocket() {
  socket = new WebSocket('ws://localhost:8000');
}

export function sendSelectedGroupData(selectedGroupData) {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const message = JSON.stringify(selectedGroupData);
      socket.send(message);
    } else {
      console.error('WebSocket connection is not open');
    }
  }
  
