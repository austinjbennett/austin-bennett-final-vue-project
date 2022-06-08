import Vue from 'vue';
import './firebase';
// import vuexfire from 'vuexfire';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;
// Vue.use(vuexfire);
Vue.directive('mainColor', {
	bind(el, binding) {
		if (binding.arg === 'text') {
			el.style.color = binding.value; // eslint-disable-line
		} else {
			el.style.backgroundColor = binding.value; // eslint-disable-line
		}
	},
	update(el, binding) {
		if (binding.arg === 'text') {
			el.style.color = binding.value; // eslint-disable-line
		} else {
			el.style.backgroundColor = binding.value; // eslint-disable-line
		}
	},
});

new Vue({
	router,
	store,
	vuetify,
	render: (h) => h(App),
}).$mount('#app');
