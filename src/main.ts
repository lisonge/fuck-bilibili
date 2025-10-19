import { createApp } from 'vue';
import pkg from '../package.json';
import App from './App.vue';

const container = document.body.appendChild(document.createElement('div'));
container.classList.add(pkg.name);
const shadowRoot = container.attachShadow({ mode: 'open' });
createApp(App).mount(shadowRoot.appendChild(document.createElement('div')));
