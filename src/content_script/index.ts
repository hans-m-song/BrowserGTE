import {Header, SELECTORS, Sender} from '@util/constants';
import {waitForEl} from '@util/functions';
import {logMessage, message, Message} from '@util/message';
import {ConversationObserver} from './observers';

const {compose} = message(Sender.ContentScript);

const createHoverTag = () => {
  const hoverTag = document.createElement('div');
  hoverTag.className = 'MTHoverTag';
  document.body.appendChild(hoverTag);
  return hoverTag;
};

const hoverTag = createHoverTag();

waitForEl(SELECTORS.MAIN).then(async (main) => {
  console.log('setup', main, hoverTag);
  document.addEventListener('mouseover', (event) => {
    if ((event.target as HTMLElement).className === 'MTEmote') {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      hoverTag.innerText =
        (event.target as HTMLElement).getAttribute('mte-data') || 'unknown';
      hoverTag.style.top =
        rect.top + document.documentElement.scrollTop - rect.height + 'px';
      hoverTag.style.left =
        rect.left + document.documentElement.scrollLeft + 'px';
      hoverTag.style.display = 'block';
    } else if (hoverTag.style.display !== 'none') {
      hoverTag.style.display = 'none';
    }
  });
  await new ConversationObserver().start();
});

chrome.runtime.onMessage.addListener(
  (message: Message, _sender, sendResponse) => {
    switch (message.header) {
      default: {
        logMessage(message, 'unhandled message');
        sendResponse(compose(Header.ERROR));
      }
    }
    return true;
  },
);
