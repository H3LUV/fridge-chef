(() => {
  const splash = document.getElementById('h3LaunchSplash');
  if (!splash) return;

  const dismiss = () => {
    splash.classList.add('is-leaving');
    window.setTimeout(() => splash.remove(), 620);
  };

  const ready = document.readyState === 'complete'
    ? Promise.resolve()
    : new Promise((resolve) => window.addEventListener('load', resolve, { once: true }));

  ready.then(() => {
    const elapsed = performance.now();
    const minimum = 1550;
    window.setTimeout(dismiss, Math.max(0, minimum - elapsed));
  });

  window.setTimeout(dismiss, 2600);
})();
