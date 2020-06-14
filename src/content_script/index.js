const { compose } = require('../util/message').content_script;
const { MESSAGETYPES, SELECTORS } = require('../util/constants');
const { ConversationObserver } = require('./observers');
const { waitForEl } = require('../util/utils');

const createHoverTag = () => {
    const hoverTag = document.createElement('div');
    hoverTag.className = 'MTHoverTag';
    document.body.appendChild(hoverTag);
    return hoverTag;
}

const hoverTag = createHoverTag();

waitForEl(SELECTORS.MAIN)
    .then(async (main) => {
        console.log('setup', main, hoverTag);
        document.addEventListener('mouseover', (event) => {
            if (event.target.className === 'MTEmote') {
                const rect = event.target.getBoundingClientRect();
                hoverTag.innerText = event.target.getAttribute('mte-data') || 'unknown';
                hoverTag.style.top = rect.top + document.documentElement.scrollTop - rect.height + 'px';
                hoverTag.style.left = rect.left + document.documentElement.scrollLeft + 'px';
                hoverTag.style.display = 'block';
            } else if (hoverTag.style.display !== 'none') {
                hoverTag.style.display = 'none';
            }
        });
        window.MTEConversationObserver = new ConversationObserver();
        await MTEConversationObserver.start();
    });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const logLevel = message.level;

    switch (message.header) {
        default: {
            console[logLevel]('unhandled message', message, sender);
            sendResponse(compose(MESSAGETYPES.NACK));
        };
    }
    return true;
});
