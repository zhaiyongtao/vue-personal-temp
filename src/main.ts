import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'amfe-flexible/index.js';
import App from './App.vue';
import router from './router';
import './assets/styles/main.scss';
import './utils/rem.js';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.mount('#app');
