document.addEventListener('DOMContentLoaded', function () {
  // Force navigation for pagination links as a safe fallback
  const pagination = document.querySelector('.pagination');
  if (!pagination) return;

  pagination.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      // If the event was already prevented by another handler, still force navigation
      const href = this.getAttribute('href');
      if (!href) return;
      e.preventDefault();
      // Use location.assign so it's recorded in history
      window.location.assign(href);
    });
  });
});