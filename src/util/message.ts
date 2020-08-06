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

export const message = (sender: Sender): Communication => ({
  send: (header, data, level) =>
    new Promise((resolve) =>
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) =>
        chrome.tabs.sendMessage(
          tabs[0].id!,
          compose(header, sender, data || '', level),
          (response) => resolve(response),
        ),
      ),
    ),
  compose: (header, data, level) => compose(header, sender, data || '', level),
});
