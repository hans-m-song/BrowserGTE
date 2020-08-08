import {Header, Sender} from '@util/constants';
import {message} from '@util/message';
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
    const response = await send(Header.IMPORT, data);
    console.log('import response', response);
    setMessage(Section.Import, `${response.header} ${response.sender}`);
  } catch (e) {
    console.error(e);
    setMessage(Section.Import, `Error: ${e.message}`);
  }
};

element(Section.Export, El.Submit).onclick = async () => {
  try {
    const response = await send(Header.EXPORT);
    console.log('export response', response);
    const data = JSON.stringify(response.data, null, 4);

    const inputEl = element(Section.Export, El.Input);
    inputEl.value = data;
    resizeTextArea(inputEl);

    setMessage(Section.Export, `${response.header} ${response.sender}`);
  } catch (e) {
    console.error(e);
    setMessage(Section.Export, `Error: ${e.message}`);
  }
};
