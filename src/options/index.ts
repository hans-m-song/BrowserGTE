import {Header, Sender} from '@util/constants';
import {message} from '@util/message';

const {send} = message(Sender.Background);

const getElement = (id: string): HTMLElement => document.getElementById(id)!;

const importBtn = getElement('import');
const exportBtn = getElement('export');
const messageDiv = getElement('message');

importBtn.onclick = () => {
  messageDiv.innerText = 'export';
  send(Header.IMPORT, {});
};

exportBtn.onclick = () => {
  messageDiv.innerText = 'export';
  send(Header.EXPORT, {});
};
