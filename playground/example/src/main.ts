import style1 from './style1.css?style';
import style2 from 'normalize.css?style';

const container = document.body
  .appendChild(document.createElement('div'))
  .attachShadow({ mode: 'open' });
container.appendChild(document.createElement('h1')).textContent = 'Test Styles';
container.append(style1); // with hmr when change style1.css
container.append(style2);
const style3 = style1.cloneNode(); // it will still have hmr
container.append(style3);
