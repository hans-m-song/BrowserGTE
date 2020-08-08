export const SELECTORS = {
  MAIN: 'div[role=main]',
  CONVERSATIONS: 'div[aria-label=Conversations]',
  MESSAGES: 'div[aria-label=Messages] > div[id^=js_]',
  SPANS: '[data-tooltip-content] > div > span',
};

export enum Sender {
  Background = 'BACKGROUND',
  ContentScript = 'CONTENTSCRIPT',
  Options = 'OPTIONS',
}

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  LOG = 'log',
}

export enum Header {
  ACK = 'ACK',
  NACK = 'NACK',
  RAW = 'RAW',
  PROCESSED = 'PROCESSED',
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',
}
