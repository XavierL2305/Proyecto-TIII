const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
  container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
  container.classList.remove('right-panel-active');
});

setTimeout(function() {
  const messageContainer = document.getElementById('message-container');
  if (messageContainer) {
    messageContainer.style.transition = 'opacity 0.5s ease';
    messageContainer.style.opacity = '0';
    setTimeout(() => messageContainer.remove(), 500);
  }
}, 5000);

