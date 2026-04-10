import { createApp } from 'vue';
import './firebase';
// import vuexfire from 'vuexfire';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

const app = createApp(App);

app.directive('mainColor', {
  mounted(el, binding) {
    if (binding.arg === 'text') {
      el.style.color = binding.value;
    } else {
      el.style.backgroundColor = binding.value;
    }
  },
  updated(el, binding) {
    if (binding.arg === 'text') {
      el.style.color = binding.value;
    } else {
      el.style.backgroundColor = binding.value;
    }
  },
});

app.use(store);
app.use(router);
app.use(vuetify);

app.mount('#app');
