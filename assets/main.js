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
