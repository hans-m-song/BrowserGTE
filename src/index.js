chrome.runtime.onInstalled.addListener(() => {
    console.log('installed');

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log({ request, sender });
    });
});
