const send = require('./message').content_script;
const { MESSAGETYPES, SELECTORS } = require('./constants');

const waitForEl = (selector, interval = 100) =>  new Promise(resolve => {
    const intervalHandle = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(intervalHandle);
            resolve(element);
        }
    }, interval);
});

const mutationObserver = (target, subscriber, options) =>
    waitForEl(target).then((element) =>
        new MutationObserver(subscriber).observe(element, options));

const messageWatcher = () =>
    waitForEl(SELECTORS.MESSAGES).then(container => 
        mutationObserver(SELECTORS.MESSAGES, (mutations) =>
            mutations.forEach((mutation) => {
                if (mutation.target === container && mutation.addedNodes.length > 0) {
                    console.log('mutation', mutation);
                    send(MESSAGETYPES.PROCESS, mutation.addedNodes[0].innerHTML);
                }
            }), {
                childList: true,
                subtree: true
            }));

const conversationWatcher = () =>
    mutationObserver(SELECTORS.CONVERSATIONS, (mutations) => {
        console.log('conversation mutation', mutations);
        // messageWatcher();
    }, {
        attributes: true,
        attributeFilter: true,
        attributeOldValue: true,
        characterData: true,
        characterDataOldValue: true
    });

console.log('injected content_script');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('message', message, sender);
    sendResponse(compose(MESSAGETYPES.DEBUG));
});

waitForEl(SELECTORS.MAIN).then(() =>
    conversationWatcher());