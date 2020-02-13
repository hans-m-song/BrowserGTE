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

const createImg = (code, src) => 
    ` <img src="${src}" alt="${code} "style="
        display: inline !important;
        height: auto !important;
        width: auto !important;
        max-height: 100% !important;
        opacity: 1 !important;
        outline: 0px !important;
        border: 0px !important;
        margin: 0px !important;
        padding: 0px !important;
        z-index: auto !important;
        visibility: visible !important;"
    > `;

const createRgx = (code) => new RegExp(`(^|\\s|>)${code}($|\\s|<)`, 'g');

const delay = (timeout = 500) => 
    new Promise((resolve) => 
        setTimeout(() => resolve(), timeout));

module.exports = {
    waitForEl,
    createImg,
    createRgx,
    delay,
};