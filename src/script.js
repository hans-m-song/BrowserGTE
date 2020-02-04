const message = require('./utils').message.toBackground;
const { MESSAGETYPES } = require('./constants');

const run = () => {
    const selectors = {
        container: 'div[aria-label=Messages] > div[id*=js_]',
        span: 'div[data-tooltip-content][data-hover=tooltip] div[aria-label] span',
    };

    const container = document.querySelector(selectors.container);
    container.addEventListener('DOMNodeInserted', (event) => {
        if (event.target.tagName === 'DIV') {
            const span = event.target.querySelector(selectors.span);
            message({
                type: MESSAGETYPES.PROCESS,
                data: span.innerText,
            });
        }
    });
};

run();