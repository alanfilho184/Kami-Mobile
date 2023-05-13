import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { Storage } from '@ionic/storage';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
// import '@ionic/vue/css/normalize.css';
// import '@ionic/vue/css/structure.css';
// import '@ionic/vue/css/typography.css';


// import '@ionic/vue/css/padding.css';
// import '@ionic/vue/css/float-elements.css';
// import '@ionic/vue/css/text-alignment.css';
// import '@ionic/vue/css/text-transformation.css';
// import '@ionic/vue/css/flex-utils.css';
// import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';
const storagePlugin = {
  install: async (app: any) => {
    const store = new Storage();
    const storage = await store.create();

    app.config.globalProperties.$storage = storage;
  }
};

const app = createApp(App)
  .use(IonicVue)
  .use(storagePlugin)
  .use(router);

router.isReady().then(() => {
  app.mount('#app');
});