const { compose } = require('./message').content_script;
const { MESSAGETYPES, SELECTORS } = require('./constants');
const { ConversationObserver } = require('./observers');
const { waitForEl } = require('./utils');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const logLevel = message.level;

    switch (message.header) {
        case MESSAGETYPES.MESSAGE.RAW:
        case MESSAGETYPES.MESSAGE.PROCESSED:
        case MESSAGETYPES.FETCH.REQUEST:
        case MESSAGETYPES.FETCH.RESPONSE:
        case MESSAGETYPES.ACK:
        case MESSAGETYPES.NACK:
        case MESSAGETYPES.REQUEST:
        default: {
            console[logLevel]('unhandled message', message, sender);
            sendResponse(compose(MESSAGETYPES.NACK));
        };
    }
});

const run = async () => {
    await waitForEl(SELECTORS.MAIN);
    await new ConversationObserver().start();
};

waitForEl(SELECTORS.MAIN)
    .then(() => run());