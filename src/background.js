const { loadData } = require('./storage');
const { compose } = require('./message').background;
const { Parser } = require('./parser');
const { MESSAGETYPES } = require('./constants');

chrome.runtime.onInstalled.addListener(() => {
    loadData()
        .then((data) => {
            const parser = new Parser(data);

            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                const logLevel = message.level;
        
                switch (message.header) {
                    case MESSAGETYPES.MESSAGE.RAW: {
                        const result = parser.process(message.data);
                        sendResponse(compose(MESSAGETYPES.MESSAGE.PROCESSED, result));
                        break;
                    };
                    case MESSAGETYPES.MESSAGE.PROCESSED:
                    case MESSAGETYPES.FETCH.REQUEST: {
                        // TODO handle this if needed
                    };
                    case MESSAGETYPES.FETCH.RESPONSE:
                    case MESSAGETYPES.ACK:
                    case MESSAGETYPES.NACK:
                    default: {
                        console[logLevel]('unhandled message', message, sender);
                        sendResponse(compose(MESSAGETYPES.NACK));
                    };
                }
            });
        });
});
