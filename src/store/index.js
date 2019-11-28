import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations, firestoreAction } from 'vuexfire';
import firebase from 'firebase';
import firestore from '../firebase';

Vue.use(Vuex);
// Vue.use(firebase);

export default new Vuex.Store({
	state: {
		nextGameId: 2,
		user: null,
		username: '',
		games: {},
		uid: '',
	},
	mutations: {
		/* setStateFromFirestore(user) {
			this.state.user = user;
		}, */
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
			/* state.user.games.push({
				gameId: state.nextGameId.toString(),
				gameName: payload.gameName,
				gamePlayers: payload.players,
			}); */
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
		// setUser: (state) => { state.user = firebase.auth().currentUser; },
		...vuexfireMutations,
	},
	actions: {
		// bindUser(context) {
		// db.collection('users').doc('austin')
		// .onSnapshot((doc) => {
		// console.log('doc.data(): ', doc.data());
		// context.commit('setStateFromFirestore', doc.data());
		// });
		// },
		bindUserRef: firestoreAction(({ bindFirestoreRef }) => bindFirestoreRef('user', firestore.collection('users').doc(firebase.auth().currentUser.uid))),
		bindGamesRef: firestoreAction(({ bindFirestoreRef }) => bindFirestoreRef('games', firestore.collection('users').doc(firebase.auth().currentUser.uid).collection('games').orderBy('created', 'desc'))),
		/* newGame(context, payload) {
			context.commit('newGame', payload);
			context.commit('incrementGameId');
		}, */
		/* vuexfireBindUser() {
			console.log('vuexfireBindUser uid:', firebase.auth().currentUser.uid);
			firestoreAction(({ bindFirestoreRef }) => bindFirestoreRef('user', firestore.collection('users').doc(firebase.auth().currentUser.uid)));
		}, */
		createUser(context, payload) {
			firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
				.then(
					(authData) => {
						authData.user.updateProfile({
							displayName: payload.username,
						}).then(() => {
							context.commit('setUsername', authData.user.displayName);
							// firestore.collection('users').doc(authData.user.uid).set({ username: authData.user.displayName });
						}).catch((error) => {
							console.log('updateProfile failed: ', error);
						});

						/* const docRef = firestore.collection('users').doc(authData.user.uid);
						docRef.onSnapshot((snapshot) => {
							console.log('createUser().onSnapshot(): ', snapshot.data());
						}); */
					},
				)
				.catch(
					(error) => {
						console.log(error);
					},
				);
		},
		signIn(context, payload) {
			firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
				.then(
					/* (authData) => {
						context.commit('setUserName', authData.user.displayName);
						const docRef = firestore.collection('users').doc(authData.user.uid);
						docRef.onSnapshot((snapshot) => {
							console.log('signIn().onSnapshot(): ', snapshot.data());
							if (snapshot.exists) {
								console.log('signIn().onSnapshot() snapshot exists, user logged in');
							} else {
								console.log('signIn().onSnapshot() No user.uid document!');
							}
						});
					}, */
				)
				.catch(
					(error) => {
						console.log('signIn() Error Logging In: ', error);
					},
				);
		},
		/* setUser(context, uid) {
			firestore.collection('users').doc(uid).onSnapshot((snapshot) => {
				if (snapshot.exists) {
					console.log('setUser().onSnapshot(): ', snapshot.data());
					context.commit('setUser', snapshot.data());
				}
			});
		}, */
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
	},
	getters: {
		user: state => state.user,
		uid: state => state.uid,
		players: state => (state.user ? state.user.players : []),
		playersLength: state => (state.user ? state.user.players.length : 0),
		username: state => state.username || '',
		nextGameId: state => state.nextGameId || 0,
		games: state => state.games || [],
		currentGame: state => gameId => state.games.find(o => o.gameId === gameId),
	},
});
