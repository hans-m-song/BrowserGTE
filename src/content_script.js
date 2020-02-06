const { content_script: send, compose } = require('./message');
const { MESSAGETYPES, SELECTORS, OBSERVERCONFIG } = require('./constants');

const waitForEl = (selector, interval = 100) =>  new Promise(resolve => {
    const intervalHandle = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(intervalHandle);
            resolve(element);
        }
    }, interval);
});

const mutationObserver = (target, subscriber) =>
    new Promise((resolve) => 
        waitForEl(target).then((element) => {
            const observer = new MutationObserver(subscriber);
            observer.observe(element, OBSERVERCONFIG.MESSAGES);
            resolve(observer);
        }));

let messages;

const messageWatcher = () =>
    new MutationObserver((mutations) =>
        mutations.forEach((mutation) => {
            if (mutation.target === messages && mutation.addedNodes.length > 0) {
                send(MESSAGETYPES.PROCESS, mutation.addedNodes[0].innerHTML);
            }
        }));

const conversationWatcher = async () => {
    messages = await waitForEl(SELECTORS.MESSAGES);
    const messageObserver = messageWatcher();
    messageObserver.observe(messages, OBSERVERCONFIG.MESSAGES);

    const conversations = await waitForEl(SELECTORS.CONVERSATIONS);
    const conversationObserver = new MutationObserver((mutations) => {
        console.log('conversation mutation', mutations);
        waitForEl(SELECTORS.MESSAGES).then((element) => {
            messages = element;
            messageObserver.disconnect();
            messageObserver.observe(messages, OBSERVERCONFIG.MESSAGES);
        });
    });
    conversationObserver.observe(conversations, {
        attributes: true,
        characterData: true,
        subtree: true,
    });
}

console.log('injected content_script');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('message', message, sender);
    sendResponse(compose(MESSAGETYPES.DEBUG));
});


waitForEl(SELECTORS.MAIN).then(() => {
    conversationWatcher();
});