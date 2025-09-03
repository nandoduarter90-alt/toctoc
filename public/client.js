const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const imageInput = document.getElementById('imageInput');
const messagesDiv = document.getElementById('messages');

// Enviar mensaje de texto
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

// Enviar imagen
imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const imageData = reader.result; // base64
    socket.emit('chat image', imageData);
  };
  reader.readAsDataURL(file);
  imageInput.value = ''; // limpiar el input
});

// Recibir mensajes de texto
socket.on('chat message', (msg) => {
  const p = document.createElement('p');
  p.textContent = msg;
  messagesDiv.appendChild(p);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Recibir imágenes
socket.on('chat image', (imageData) => {
  const img = document.createElement('img');
  img.src = imageData;
  messagesDiv.appendChild(img);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
