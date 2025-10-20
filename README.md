# vite-plugin-style

A Vite plugin to handle CSS imports as style nodes(HTMLStyleElement).

Support `.css?style`, `.less?style`, `.sass?style`, `.scss?style`, `.styl?style`, `.stylus?style`, `.pcss?style`, `.postcss?style` and `.sss?style` imports

## usage

```shell
pnpm add vite-plugin-style
```

```js
// vite.config.js
import { defineConfig } from 'vite';
import style from 'vite-plugin-style';

export default defineConfig({
  plugins: [style()],
});
```

```js
// vite-env.d.ts
// add this line for typescript support
/// <reference types="vite-plugin-style/client" />
```

## example

```js
// main.ts
import style1 from './style1.css?style';
import style2 from 'normalize.css?style';

const container = document.body
  .appendChild(document.createElement('div'))
  .attachShadow({ mode: 'open' });
container.appendChild(document.createElement('h1')).textContent = 'Test Styles';
container.append(style1); // with hmr when change style1.css
container.append(style2);
const style3 = style1.cloneNode(true); // it will still have hmr
container.append(style3);

```

will be compiled to:

```js
// dist/index-hash.js
const style1Css = "h1{color:red}";
var a;
const d = (b) => (a = document.createElement("style"), a.append(b), a);
const style1 = d(style1Css);
const normalizeCss = ".xxx{}";
const style2 = d(normalizeCss);
const container = document.body.appendChild(document.createElement("div")).attachShadow({ mode: "open" });
container.appendChild(document.createElement("h1")).textContent = "Test Styles";
container.append(style1);
container.append(style2);
const style3 = style1.cloneNode(true);
container.append(style3);
```
