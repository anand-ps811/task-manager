const socket = io();

// Set Username with Validation
function setUsername() {
  const usernameInput = document.getElementById('usernameInput');
  const username = usernameInput.value.trim();
  const nameError = document.getElementById('nameError');

  // Validation checks
  if (!username) {
    nameError.textContent = 'Username cannot be empty!';
    return;
  }
  if (username.length < 3) {
    nameError.textContent = 'Username must be at least 3 characters!';
    return;
  }
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    nameError.textContent = 'Username can only contain alphanumeric characters!';
    return;
  }

  // Clear error message if validation passed
  nameError.textContent = '';

  // Emit the username to the server
  socket.emit('set username', username);

  // Show navigation and global chat after setting username
  document.getElementById('username-container').style.display = 'none';
  document.getElementById('navigation').style.display = 'block';
//   showGlobalChat(); 
}


function showGlobalChat() {
  hideAllScreens();
  document.getElementById('globalChat').style.display = 'block';
}

function showRoomChat() {
  hideAllScreens();
  document.getElementById('roomChat').style.display = 'block';
}

function hideAllScreens() {
  document.getElementById('globalChat').style.display = 'none';
  document.getElementById('roomChat').style.display = 'none';
}

// Global Chat
function sendGlobalMessage() {
  const message = document.getElementById('globalMessage').value;
  socket.emit('chat message', message);
  document.getElementById('globalMessage').value = '';
}

socket.on('chat message', (data) => {
  const item = document.createElement('li');
  item.textContent = `${data.name}: ${data.msg}`;
  document.getElementById('globalMessages').appendChild(item);
});

// Room Chat
function joinRoom() {
  const room = document.getElementById('roomName').value;
  socket.emit('join room', room);
}

function sendRoomMessage() {
  const room = document.getElementById('roomName').value;
  const message = document.getElementById('roomMessage').value;
  socket.emit('room message', { room, message });
  document.getElementById('roomMessage').value = '';
}

socket.on('room message', (data) => {
  const item = document.createElement('li');
  item.textContent = `${data.name}: ${data.message}`;
  document.getElementById('roomMessages').appendChild(item);
});
