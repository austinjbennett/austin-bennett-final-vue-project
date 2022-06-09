import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations, firestoreAction } from 'vuexfire';
import firebase from 'firebase/compat/app';
import firestore from '../firebase';

Vue.use(Vuex);
// Vue.use(firebase);

export default new Vuex.Store({
	state: {
		nextGameId: 2,
		user: null,
		username: '',
		games: [],
		uid: '',
		mainColor: '#1976d2',
		error: null,
		loginDisabled: false,
	},
	mutations: {
		addPlayer(state, player) {
			state.user.players.push(player);
		},
		editPlayer(state, player, index) {
			state.user.players[index] = player;
			firestore.collection('users').doc(state.uid).set({
				players: state.user.players,
			});
		},
		removePlayer(state, index) {
			state.user.players.splice(index, 1);
			firestore.collection('users').doc(state.uid).set({
				players: state.user.players,
			});
		},
		incrementGameId(state) {
			state.nextGameId += 1;
		},
		newGame(state, payload) {
			firestore.collection('users').doc(state.uid).collection('games').add({
				gameId: state.nextGameId.toString(),
				gameName: payload.gameName,
				gamePlayers: payload.players,
			});
		},
		setUser(state, userData) {
			state.user = userData;
		},
		setUid(state, uid) {
			state.uid = uid;
		},
		setUsername(state, username) {
			state.username = username;
		},
		signOut() {
			firebase.auth().signOut();
		},
		resetState(state) {
			state.user = null;
			state.username = '';
			state.games = {};
			state.uid = '';
		},
		error(state, error) {
			state.error = error;
		},
		disableLogin(state) {
			state.loginDisabled = true;
		},
		enableLogin(state) {
			state.loginDisabled = false;
		},
		setColor(state, color) {
			state.mainColor = color;
		},
		...vuexfireMutations,
	},
	actions: {
		bindUserRef: firestoreAction(({ bindFirestoreRef }) => bindFirestoreRef('user', firestore.collection('users').doc(firebase.auth().currentUser.uid))),
		bindGamesRef: firestoreAction(({ bindFirestoreRef }) => bindFirestoreRef('games', firestore.collection('users').doc(firebase.auth().currentUser.uid).collection('games').orderBy('created', 'desc'))),

		createUser(context, payload) {
			firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
				.then(
					(authData) => {
						authData.user.updateProfile({
							displayName: payload.username,
						}).then(() => {
							context.commit('setUsername', authData.user.displayName);
						}).catch((error) => {
							console.error('updateProfile failed: ', error);
						});
					},
				)
				.catch(
					(error) => {
						console.error(error);
						context.commit('enableLogin');
					},
				);
		},
		signIn(context, payload) {
			firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
				.then()
				.catch(
					(error) => {
						console.error('signIn() Error Logging In: ', error);
						if (error.code === 'auth/wrong-password') {
							context.commit('error', 'Incorrect password. Please try again.');
							context.commit('enableLogin');
						} else if (error.code === 'auth/user-not-found') {
							context.commit('error', 'No user found with that email. Create a new account instead?');
							context.commit('enableLogin');
						}
					},
				);
		},
		setUid(context, uid) {
			context.commit('setUid', uid);
		},
		setUsername(context, username) {
			context.commit('setUsername', username);
		},
		editPlayer(context, player, index) {
			context.commit('editPlayer', player, index);
		},
		removePlayer(context, player, index) {
			context.commit('removePlayer', player, index);
		},
		signOut(context) {
			context.commit('signOut');
		},
		setColor(context, color) {
			context.commit('setColor', color);
		},
	},
	getters: {
		user: (state) => state.user,
		uid: (state) => state.uid,
		players: (state) => (state.user ? state.user.players : []),
		playersLength: (state) => (state.user ? state.user.players.length : 0),
		username: (state) => state.username || '',
		nextGameId: (state) => state.nextGameId || 0,
		games: (state) => state.games || [],
		currentGame: (state) => (gameId) => state.games.find((o) => o.gameId === gameId),
		error: (state) => state.error,
		loginDisabled: (state) => state.loginDisabled,
		mainColor: (state) => state.mainColor,
	},
});
