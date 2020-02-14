const waitForEl = (selector, interval = 100) => new Promise(resolve => {
    const intervalHandle = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            console.log('found element', element);
            clearInterval(intervalHandle);
            resolve(element);
        }
    }, interval);
});

const createEl = (code, src) => 
    ` <div class="MTWrapper"><img src="${src}" alt="${code}" class="MTEmote"><span class="MTTag"> ${code}</span></div> `;

const createRgx = (code) => new RegExp(`(^|\\s|>)${code}($|\\s|<)`, 'g');

const delay = (timeout = 500) => 
    new Promise((resolve) => 
        setTimeout(() => resolve(), timeout));

module.exports = {
    waitForEl,
    createEl,
    createRgx,
    delay,
};