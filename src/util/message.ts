import {ParserConfig} from 'background/Parser';
import {Header, LogLevel, Sender} from './constants';

export interface Message {
  header: Header;
  sender: Sender;
  data: unknown;
  level: LogLevel;
}
export interface ParseMessage extends Message {
  header: Header.PROCESSED | Header.RAW;
  data: string;
}

export interface ComMessage extends Message {
  header: Header.ACK | Header.NACK;
  data: string;
}

export interface OptMessage extends Message {
  header: Header.IMPORT | Header.EXPORT;
  data: ParserConfig;
}

const composeMessage = (
  header: Header,
  sender: Sender,
  data: Message['data'],
  level = LogLevel.LOG,
): Message => ({
  header,
  level,
  sender,
  data,
});

interface Communication {
  send: (
    header: Header,
    data?: Message['data'],
    level?: LogLevel,
  ) => Promise<Message>;
  compose: (
    header: Header,
    data?: Message['data'],
    level?: LogLevel,
  ) => Message;
}

const toExtension = (message: Message): Promise<Message> =>
  new Promise((resolve) =>
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) =>
      chrome.tabs.sendMessage(tabs[0].id!, message, (response) =>
        resolve(response),
      ),
    ),
  );

const toContentScript = (message: Message): Promise<Message> =>
  new Promise((resolve) =>
    chrome.runtime.sendMessage(message, (response) => resolve(response)),
  );

export const message = (sender: Sender) => {
  const compose: Communication['compose'] = (header, data, level) =>
    composeMessage(header, sender, data, level);

  const send: Communication['send'] = (header, data, level) => {
    const message = composeMessage(header, sender, data, level);

    switch (sender) {
      case Sender.Options:
      case Sender.Background:
        return toContentScript(message);
      case Sender.ContentScript:
        return toExtension(message);
    }
  };

  return {
    compose,
    send,
  };
};
