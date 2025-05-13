self.addEventListener('push', function(event) {
  const data = event.data.json();

  self.registration.showNotification('Sunflower Manager', {
    body: `${data.index} ready.`,
    icon: '/icon.png', // optionnel
  });
});