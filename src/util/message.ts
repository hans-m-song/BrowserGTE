import {Header, LogLevel, Sender} from './constants';

interface MessageTemplate {
  header: Header;
  sender: Sender;
  data: unknown;
  level: LogLevel;
}
interface ParseMessage extends MessageTemplate {
  header: Header.PROCESSED | Header.RAW;
  data: string;
}

interface ComMessage extends MessageTemplate {
  header: Header.ACK | Header.NACK;
  data: string;
}

export type Message = ParseMessage | ComMessage;

const compose = (
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

export const background: Communication = {
  send: (header, data, level) =>
    new Promise((resolve) =>
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) =>
        chrome.tabs.sendMessage(
          tabs[0].id!,
          compose(header, Sender.Background, data || '', level),
          (response) => resolve(response),
        ),
      ),
    ),
  compose: (header, data, level) =>
    compose(header, Sender.Background, data || '', level),
};

export const contentScript: Communication = {
  send: (header, data, level) =>
    new Promise((resolve) =>
      chrome.runtime.sendMessage(
        compose(header, Sender.ContentScript, data || '', level),
        (response) => resolve(response),
      ),
    ),
  compose: (header, data, level) =>
    compose(header, Sender.ContentScript, data || '', level),
};
