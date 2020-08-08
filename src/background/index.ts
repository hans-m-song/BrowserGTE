import {Header, LogLevel, Sender} from '@util/constants';
import {stringifyError} from '@util/functions';
import {logMessage, message, Message} from '@util/message';
import {ParserConfig, ParserConfigType} from './config';
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
  (message: Message, _sender, sendResponse) => {
    initParser().then((parser) => {
      logMessage(message, 'received message');

      try {
        switch (message.header) {
          case Header.RAW: {
            const result = parser.process(message.data as string);
            sendResponse(compose(Header.PROCESSED, result));
            break;
          }
          case Header.IMPORT: {
            parser = new Parser(message.data as ParserConfig);
            sendResponse(compose(Header.OK));
            break;
          }
          case Header.EXPORT: {
            const data = parser.toJSON();
            const message = compose(Header.EXPORT, {
              type: ParserConfigType.Storage,
              ...data,
            });
            sendResponse(message);
            break;
          }
          default: {
            throw new Error('unhandled message type');
          }
        }
      } catch (e) {
        const message = compose(
          Header.ERROR,
          stringifyError(e),
          LogLevel.ERROR,
        );
        logMessage(message, 'error handling message');
        sendResponse(message);
      }
    });

    return true;
  },
);
