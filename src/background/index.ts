import {Header, Sender} from '@util/constants';
import {message, Message, ParseMessage} from '@util/message';
import {Parser} from './Parser';

const {compose} = message(Sender.Background);

let parser: Parser;
let initializing = false;

const waitForInit = (): Promise<Parser> =>
  new Promise((resolve) => {
    const interval = setInterval(() => {
      if (parser) {
        clearInterval(interval);
        resolve(parser);
      }
    }, 100);
  });

const initParser = (): Promise<Parser> =>
  new Promise((resolve) => {
    if (!parser && !initializing) {
      console.log('initializing parser');
      initializing = true;
      new Parser()
        .init()
        .then((initializedParser) => {
          parser = initializedParser;
          resolve(initializedParser);
        })
        .catch((error) => console.warn(error));
    } else if (!parser && initializing) {
      console.log('waiting for parser to initialize');
      waitForInit().then((parser) => resolve(parser));
    } else {
      resolve(parser);
    }
  });

chrome.runtime.onMessage.addListener(
  (message: Message, sender, sendResponse) => {
    initParser().then((parser) => {
      const logLevel = message.level || 'log';
      console[logLevel](`MESSAGE.${message.header}`, message);

      // TODO handle adding new channels, custom emotes, etc
      try {
        switch (message.header) {
          case Header.RAW: {
            const result = parser.process((message as ParseMessage).data);
            sendResponse(compose(Header.PROCESSED, result));
            break;
          }
          case Header.IMPORT:
          case Header.EXPORT:
            break;
          default: {
            throw new Error('unhandled message type');
          }
        }
      } catch (error) {
        console.warn(error, message, sender);
        console.error(
          JSON.stringify(error, Object.getOwnPropertyNames(error)),
          JSON.stringify(message),
          sender,
        );
        sendResponse(compose(Header.NACK));
      }
    });

    return true;
  },
);
