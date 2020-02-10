const { compose } = require('./message').content_script;
const { MESSAGETYPES, SELECTORS } = require('./constants');
const { ConversationObserver } = require('./observers');
const { waitForEl } = require('./utils');

console.log('MTE content_script injected');
waitForEl(SELECTORS.MAIN)
    .then(async () => {
        await waitForEl(SELECTORS.MAIN);
        await new ConversationObserver().start();
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
