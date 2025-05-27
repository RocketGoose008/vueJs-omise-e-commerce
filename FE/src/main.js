import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // นำเข้า router
import store from './store'; // นำ store มาใช้งาน
import './assets/styles.css'; // นำเข้า CSS

createApp(App)
  .use(router) // ใช้ router
  .use(store) // ใช้ Vuex หากต้องการ
  .mount('#app');
