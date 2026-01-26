let activeOverlay = null;
let activeImage = null;
let mql = null;
let resizeHandler = null;

// create a container and set the full-size image as its background
function createOverlay(image, zoomSrc) {
  const overlayImage = document.createElement('img');
  const overlaySource = zoomSrc || image.src;
  overlayImage.setAttribute('src', `${overlaySource}`);
  const overlay = document.createElement('div');
  prepareOverlay(overlay, overlayImage);

  image.classList.add('image-magnify-loading');
  toggleLoadingSpinner(image);

  overlayImage.onload = () => {
    toggleLoadingSpinner(image);
    image.parentElement.insertBefore(overlay, image);
    image.classList.remove('image-magnify-loading');
    image.classList.add('image-magnify-ready');
  };

  return overlay;
}

function prepareOverlay(container, image) {
  container.setAttribute('class', 'image-magnify-full-size');
  container.setAttribute('aria-hidden', 'true');
  container.style.backgroundImage = `url('${image.src}')`;
}

function toggleLoadingSpinner(image) {
  const loadingSpinner = image.parentElement.parentElement.querySelector(`.loading__spinner`);
  if (loadingSpinner) {
    loadingSpinner.classList.toggle('hidden');
  }
}

function moveWithHover(image, overlay, event, zoomRatio) {
  // calculate mouse position
  const ratio = image.height / image.width;
  const container = event.target.getBoundingClientRect();
  const xPosition = event.clientX - container.left;
  const yPosition = event.clientY - container.top;
  const xPercent = `${xPosition / (image.clientWidth / 100)}%`;
  const yPercent = `${yPosition / ((image.clientWidth * ratio) / 100)}%`;

  // determine what to show in the frame
  overlay.style.backgroundPosition = `${xPercent} ${yPercent}`;
  overlay.style.backgroundSize = `${image.width * zoomRatio}px`;
}

function removeOverlay() {
  if (activeOverlay) {
    activeOverlay.remove();
    activeOverlay = null;
  }
  if (activeImage) {
    activeImage.classList.remove('image-magnify-active');
    activeImage = null;
  }
}

function magnify(image, zoomRatio) {
  removeOverlay();
  const zoomSource = image.dataset.techZoomSrc || image.src;
  const overlay = createOverlay(image, zoomSource);
  activeOverlay = overlay;
  activeImage = image;
  image.classList.add('image-magnify-active');
  overlay.onclick = () => removeOverlay();
  overlay.onmousemove = (event) => moveWithHover(image, overlay, event, zoomRatio);
  overlay.onmouseleave = () => removeOverlay();
}

function handlePointerEnter(event, zoomRatio) {
  const image = event.target.closest('[data-tech-zoom="true"]');
  if (!image) return;
  magnify(image, zoomRatio);
  if (activeOverlay) {
    moveWithHover(image, activeOverlay, event, zoomRatio);
  }
}

function handlePointerMove(event, zoomRatio) {
  if (!activeOverlay || !activeImage) return;
  moveWithHover(activeImage, activeOverlay, event, zoomRatio);
}

function handlePointerLeave() {
  removeOverlay();
}

function enableZoomOnHover(zoomRatio) {
  const images = document.querySelectorAll('[data-tech-zoom="true"]');
  images.forEach((image) => {
    image.removeEventListener('mouseenter', image.__magnifyEnter);
    image.removeEventListener('mousemove', image.__magnifyMove);
    image.removeEventListener('mouseleave', image.__magnifyLeave);
    image.removeEventListener('click', image.__magnifyClick);
    image.__magnifyEnter = (event) => handlePointerEnter(event, zoomRatio);
    image.__magnifyMove = (event) => handlePointerMove(event, zoomRatio);
    image.__magnifyLeave = handlePointerLeave;
    image.__magnifyClick = removeOverlay;
    image.addEventListener('mouseenter', image.__magnifyEnter);
    image.addEventListener('mousemove', image.__magnifyMove);
    image.addEventListener('mouseleave', image.__magnifyLeave);
    image.addEventListener('click', image.__magnifyClick);
  });
}

function disableZoomOnHover() {
  removeOverlay();
  document.querySelectorAll('[data-tech-zoom="true"]').forEach((image) => {
    if (image.__magnifyEnter) {
      image.removeEventListener('mouseenter', image.__magnifyEnter);
      image.removeEventListener('mousemove', image.__magnifyMove);
      image.removeEventListener('mouseleave', image.__magnifyLeave);
      image.removeEventListener('click', image.__magnifyClick);
      image.__magnifyEnter = null;
      image.__magnifyMove = null;
      image.__magnifyLeave = null;
      image.__magnifyClick = null;
    }
  });
}

function shouldEnableZoom() {
  const gallery = document.querySelector('.tech-pdp-gallery');
  if (!gallery) return false;
  return gallery.dataset.zoomEnabled === 'true';
}

function setupMagnify(zoomRatio) {
  mql = window.matchMedia('(min-width: 990px)');

  const update = () => {
    if (mql.matches && shouldEnableZoom()) {
      enableZoomOnHover(zoomRatio);
    } else {
      disableZoomOnHover();
    }
  };

  update();
  if (mql.addEventListener) {
    mql.addEventListener('change', update);
  }

  if (!resizeHandler) {
    resizeHandler = () => {
      if (!mql.matches) {
        disableZoomOnHover();
      }
    };
    window.addEventListener('resize', resizeHandler);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setupMagnify(2));
} else {
  setupMagnify(2);
}
