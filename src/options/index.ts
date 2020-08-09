import {Header, Sender} from '@util/constants';
import {logMessage, message} from '@util/message';
import {El, element, resizeTextArea, Section, setMessage} from './utils';

const {send} = message(Sender.Options);

Array.from(document.getElementsByTagName('textarea')).forEach((textArea) => {
  resizeTextArea(textArea);
  textArea.addEventListener('input', () => resizeTextArea(textArea));
});

[Section.Import, Section.Export].forEach(
  (section) =>
    (element(section, El.Clear).onclick = () => {
      element(section, El.Input).value = '';
      setMessage(section, '');
      resizeTextArea(element(section, El.Input));
    }),
);

element(Section.Import, El.Submit).onclick = async () => {
  try {
    const input = element(Section.Import, El.Input);
    const data = JSON.parse(input.value);
    const message = await send.toExtension(Header.IMPORT, data);
    logMessage(message, 'import response');
    setMessage(Section.Import, `${message.sender}: ${message.header}`);
  } catch (e) {
    console.error(e);
    setMessage(Section.Import, `Error: ${e.message}`);
  }
};

element(Section.Export, El.Submit).onclick = async () => {
  try {
    const message = await send.toExtension(Header.EXPORT);
    logMessage(message, 'export response');
    const data = JSON.stringify(message.data, null, 4);
    const inputEl = element(Section.Export, El.Input);
    inputEl.value = data;
    resizeTextArea(inputEl);
    setMessage(Section.Export, `${message.sender}: ${message.header}`);
  } catch (e) {
    console.error(e);
    setMessage(Section.Export, `Error: ${e.message}`);
  }
};
