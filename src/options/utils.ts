export enum Section {
  Import = 'import',
  Export = 'export',
}

export enum El {
  Submit = 'submit',
  Clear = 'clear',
  Message = 'message',
  Input = 'input',
}

export function element(
  section: Section,
  element: El.Submit,
): HTMLButtonElement;
export function element(section: Section, element: El.Clear): HTMLButtonElement;
export function element(section: Section, element: El.Message): HTMLDivElement;
export function element(
  section: Section,
  element: El.Input,
): HTMLTextAreaElement;
export function element(section: Section, element: El) {
  const selector = `#${section} .${element}`;
  const el = document.querySelector(selector);
  switch (element) {
    case El.Submit:
    case El.Clear:
      return el as HTMLButtonElement;
    case El.Message:
      return el as HTMLDivElement;
    case El.Input:
      return el as HTMLTextAreaElement;
  }
}

export const resizeTextArea = (textArea: HTMLTextAreaElement) => {
  textArea.style.height = 'auto';
  textArea.style.height = `${Math.min(
    textArea.scrollHeight,
    window.innerHeight - 80,
  )}px`;
};

export const setMessage = (section: Section, message: string) =>
  (element(section, El.Message).innerText = `Message: ${message || ''}`);
