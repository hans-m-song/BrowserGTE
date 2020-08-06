const getElement = (id: string): HTMLElement => document.getElementById(id)!;

const importBtn = getElement('import');
const exportBtn = getElement('export');
const messageDiv = getElement('message');

importBtn.onclick = () => (messageDiv.innerText = 'import');

exportBtn.onclick = () => (messageDiv.innerText = 'export');
