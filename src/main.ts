import { createApp } from 'vue';
import axios from 'axios';
import { IonicVue } from '@ionic/vue';
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';

import App from './App.vue';
import router from './router';

/* Ionic core CSS */
import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
import '@ionic/vue/css/utils.bundle.css';
import '@ionic/vue/css/palettes/dark.always.css';

/* Tema Stockbit-style */
import './theme/variables.css';

const http = axios.create({
  baseURL: 'https://api.coinlore.net/api',
  timeout: 10000,
});

const queryClient = new QueryClient();

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(VueQueryPlugin, { queryClient });

// Axios tersedia lewat inject('http') dan this.$http
app.provide('http', http);
app.config.globalProperties.$http = http;

router.isReady().then(() => app.mount('#app'));
