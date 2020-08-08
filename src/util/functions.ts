export const waitForEl = (selector: string, interval = 100): Promise<Node> =>
  new Promise((resolve) => {
    const intervalHandle = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        console.log('found element', element);
        clearInterval(intervalHandle);
        resolve(element);
      }
    }, interval);
  });

export const createEmoteEl = (code: string, src: string, provider: string) =>
  ` <img src="${src}" alt="${code}" class="MTEmote" mte-data="${provider}: ${code}"> `;

export const createRgx = (code: string) =>
  new RegExp(`(?<=(^|\\s|>))${code.replace(/\./g, '\\.')}(?=($|\\s|<))`, 'g');

export const delay = (timeout = 500) =>
  new Promise((resolve) => setTimeout(() => resolve(), timeout));

export const stringifyError = (e: Error) => {
  console.error(e);
  const {message, stack, name} = e;
  return {message, stack: stack?.split('\n') || [], name};
};
