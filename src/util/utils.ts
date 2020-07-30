const waitForEl = (selector, interval = 100) =>
  new Promise((resolve) => {
    const intervalHandle = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        console.log('found element', element);
        clearInterval(intervalHandle);
        resolve(element);
      }
    }, interval);
  });

const createEmoteEl = (code, src, provider) =>
  ` <img src="${src}" alt="${code}" class="MTEmote" mte-data="${provider}: ${code}"> `;

const createRgx = (code) =>
  new RegExp(`(?<=(^|\\s|>))${code.replace(/\./g, '\\.')}(?=($|\\s|<))`, 'g');

const delay = (timeout = 500) =>
  new Promise((resolve) => setTimeout(() => resolve(), timeout));

module.exports = {
  waitForEl,
  createEmoteEl,
  createRgx,
  delay,
};
