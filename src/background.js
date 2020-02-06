const { storage } = require('./utils');
const { background: send, compose } = require('./message');
const { MESSAGETYPES } = require('./constants');

chrome.runtime.onInstalled.addListener(() => {
    console.log('installed background');

    storage.list().then(list =>
        console.log('list', list));

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log('message', message, sender);
        sendResponse(compose(MESSAGETYPES.DEBUG));
        send(MESSAGETYPES.DEBUG, 'test message from background').then(response =>
            console.log('response', response));
    });
});
