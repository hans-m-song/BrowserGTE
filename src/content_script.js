const { compose } = require('./message');
const { MESSAGETYPES, SELECTORS } = require('./constants');
const { ConversationObserver } = require('./observers');
const { waitForEl } = require('./utils');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('message', message, sender);
    sendResponse(compose(MESSAGETYPES.DEBUG));
});

const run = async () => {
    await waitForEl(SELECTORS.MAIN);
    await new ConversationObserver().start();
};

waitForEl(SELECTORS.MAIN)
    .then(() => run());