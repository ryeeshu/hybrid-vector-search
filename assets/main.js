// Static content and navigation remain available without JavaScript.
const printButton = document.querySelector('.print-button');
if (printButton) {
  printButton.hidden = false;
  printButton.addEventListener('click', () => window.print());
}

// Use the actual hosting origin and repository path when served over HTTP(S).
// On a local preview or file URL, retain the Pages URL derived from Git origin.
const projectURL = document.querySelector('.project-url');
const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
if (projectURL && /^https?:$/.test(window.location.protocol) && !isLocal) {
  const home = new URL('../', window.location.href);
  projectURL.href = home.href;
  projectURL.textContent = home.href;
}

// Autoplay unless the visitor prefers reduced motion. Load the frames before
// looping in numeric order, and keep manual Play/Pause controls available.
const imagePlayer = document.querySelector('[data-image-player]');
if (imagePlayer) {
  const frameImage = imagePlayer.querySelector('.animation-frame');
  const playButton = imagePlayer.querySelector('[data-play]');
  const pauseButton = imagePlayer.querySelector('[data-pause]');
  const status = imagePlayer.querySelector('.animation-status');
  const counter = imagePlayer.querySelector('.animation-counter');
  const frames = Array.from({ length: 10 }, (_, index) =>
    new URL(`${index}.png`, frameImage.src).href
  );
  let frameIndex = 0;
  let timer = null;
  let framesReady = null;

  const pause = () => {
    window.clearInterval(timer);
    timer = null;
    playButton.disabled = false;
    pauseButton.disabled = true;
    status.textContent = 'Paused';
  };

  const play = async () => {
    if (playButton.disabled) return;
    playButton.disabled = true;
    status.textContent = 'Loading frames…';
    try {
      framesReady ??= Promise.all(frames.map(src => new Promise((resolve, reject) => {
        const frame = new Image();
        frame.onload = () => resolve(frame);
        frame.onerror = reject;
        frame.src = src;
      })));
      await framesReady;
      if (document.hidden) {
        pause();
        return;
      }
      pauseButton.disabled = false;
      status.textContent = 'Playing';
      timer = window.setInterval(() => {
        frameIndex = (frameIndex + 1) % frames.length;
        frameImage.src = frames[frameIndex];
        frameImage.alt = `Graph-based vector search illustration, frame ${frameIndex + 1} of ${frames.length}.`;
        counter.textContent = `Frame ${frameIndex + 1} / ${frames.length}`;
      }, 1200);
    } catch {
      framesReady = null;
      pause();
      status.textContent = 'Could not load the animation. Please try again.';
    }
  };

  playButton.addEventListener('click', play);
  pauseButton.addEventListener('click', pause);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && timer !== null) pause();
  });
  pause();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) play();
}
