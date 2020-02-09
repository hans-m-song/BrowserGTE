const { compose } = require('./message').content_script;
const { MESSAGETYPES, SELECTORS } = require('./constants');
const { ConversationObserver } = require('./observers');
const { waitForEl } = require('./utils');

const handleMessage = async (message, sender, sendResponse) => {
    const logLevel = message.level;

    switch (message.header) {
        default: {
            console[logLevel]('unhandled message', message, sender);
            sendResponse(compose(MESSAGETYPES.NACK));
        };
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>
    handleMessage(message, sender, sendResponse));

const run = async () => {
    await waitForEl(SELECTORS.MAIN);
    await new ConversationObserver().start();
};

console.log('MTE content_script injected');
waitForEl(SELECTORS.MAIN)
    .then(() => run());