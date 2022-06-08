import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/HomeView.vue';
import Players from '../views/PlayersView.vue';
import Games from '../views/GamesView.vue';
import Game from '../views/GameView.vue';
import SignIn from '../views/SignIn.vue';
import SignUp from '../views/SignUp.vue';
import store from '../store';

Vue.use(VueRouter);

// Adding some auth route guard - TODO
/* function requireAuth(to, from, next) {
	if (store.getters.user) {
		next();
	} else {
		next('/signin');
	}
} */
function alreadyAuth(to, from, next) {
	if (store.getters.user) {
		next('/');
	} else {
		next();
	}
}

const routes = [
	{
		path: '/',
		name: 'home',
		component: Home,
	},
	{
		path: '/players',
		name: 'players',
		component: Players,
		// beforeEnter: requireAuth,
	},
	{
		path: '/games',
		name: 'games',
		component: Games,
		// beforeEnter: requireAuth,
	},
	{
		path: '/games/:gameId',
		name: 'game',
		component: Game,
		// beforeEnter: requireAuth,
	},
	{
		path: '/signIn',
		name: 'Sign In',
		component: SignIn,
		beforeEnter: alreadyAuth,
	},
	{
		path: '/signUp',
		name: 'Sign Up',
		component: SignUp,
		beforeEnter: alreadyAuth,
	},
	{
		path: '*',
		redirect: '/',
	},
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
});

export default router;
