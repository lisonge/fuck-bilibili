import { createVaporApp } from 'vue';
import pkg from '../package.json';
import App from './App.vue';
import { attachStyle } from './style';

const container = document.body.appendChild(document.createElement('div'));
container.dataset.name = pkg.name;
const shadowRoot = container.attachShadow({ mode: 'open' });
attachStyle(shadowRoot);
createVaporApp(App).mount(
  shadowRoot.appendChild(document.createElement('div'))
);
