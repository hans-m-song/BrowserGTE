const { storage } = require('./utils');
const { send, compose } = require('./message').background;
const { MESSAGETYPES } = require('./constants');

chrome.runtime.onInstalled.addListener(() => {
    console.log('installed background');

    // fetch emote lists
    // initalize matcher and replacer

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log('message', message, sender);
        sendResponse(compose(MESSAGETYPES.DEBUG, message.data));
    });
});
