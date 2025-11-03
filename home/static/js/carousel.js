document.addEventListener('DOMContentLoaded', function () {
  const carousel = document.getElementById('heroCarousel');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const nextBtn = carousel.querySelector('.carousel-button.next');
  const prevBtn = carousel.querySelector('.carousel-button.prev');
  let index = 0;

  // set widths explicitly to avoid layout issues on some setups
  function setSlideWidths() {
    const w = carousel.clientWidth;
    slides.forEach(slide => {
      slide.style.minWidth = w + 'px';
      slide.style.width = w + 'px';
    });
    // ensure track has enough width (optional)
    track.style.width = (w * slides.length) + 'px';
    update();
  }

  function update() {
    const w = carousel.clientWidth;
    track.style.transform = `translateX(-${index * w}px)`;
  }

  nextBtn.addEventListener('click', function () {
    index = (index + 1) % slides.length;
    update();
  });

  prevBtn.addEventListener('click', function () {
    index = (index - 1 + slides.length) % slides.length;
    update();
  });

  // listen resize so slides keep correct width
  window.addEventListener('resize', setSlideWidths);

  // autoplay (opcional)
  let autoplay = setInterval(function () {
    index = (index + 1) % slides.length;
    update();
  }, 5000);

  // pausa on hover
  carousel.addEventListener('mouseenter', () => clearInterval(autoplay));
  carousel.addEventListener('mouseleave', () => {
    autoplay = setInterval(function () {
      index = (index + 1) % slides.length;
      update();
    }, 5000);
  });

  // ensure initial position
  // check images exist and set widths after images/layout settle
  // small timeout to allow fonts and layout to stabilize
  setTimeout(() => {
    // log missing images for debugging
    slides.forEach((s, i) => {
      const img = s.querySelector('img');
      if (img) {
        if (!img.complete) {
          img.addEventListener('error', () => console.warn('Carousel image failed to load:', img.src));
        }
        if (img.naturalWidth === 0) console.warn('Carousel image not available (naturalWidth=0):', img.src);
      } else {
        console.warn('Carousel slide has no img element, slide index:', i);
      }
    });
    setSlideWidths();
  }, 50);
});
