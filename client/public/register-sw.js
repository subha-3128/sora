// Register service worker for offline support and PWA capability
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js', { scope: '/' })
      .then((registration) => {
        console.log('Service Worker registered:', registration);
        
        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });

  // Handle service worker updates
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    console.log('Service Worker updated, reloading page...');
    window.location.reload();
  });
}

// Detect when device is online/offline
window.addEventListener('online', () => {
  console.log('Device is online');
  // Trigger data sync if needed
  if (window.syncPendingData) {
    window.syncPendingData();
  }
});

window.addEventListener('offline', () => {
  console.log('Device is offline - using cached data');
});
