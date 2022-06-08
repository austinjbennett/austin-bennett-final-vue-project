<template>
	<v-container class="grey lighten-5 mt-6">
		<v-row>
			<v-col cols="12">
				<h2>Ready for a new game {{ username }}?</h2>
				<v-card class="pa-4">
					<transition name="fade">
						<div class="error-message" v-if="showError">{{ errorMessage }}</div>
					</transition>
					<ol class="players-list text-left pa-0">
						<player></player>
					</ol>
					<v-form @submit.prevent="addPlayer">
						<v-row>
							<v-col cols="12" sm="9">
								<v-text-field class="player-input" v-model="playerName" label="Player Name"></v-text-field>
							</v-col>
							<v-col cols="12" sm="3" class="d-flex align-center">
								<v-btn type="submit" block class="my-1 white--text" v-mainColor="mainColor">Add Player</v-btn>
							</v-col>
						</v-row>
					</v-form>
				</v-card>
			</v-col>
		</v-row>
		<v-row>
			<v-col>
				<v-text-field class="game-name-input" v-model="gameName" label="Game Name"></v-text-field>
				<v-btn
					v-mainColor="mainColor"
					class="white--text"
					@click="newGame"
				>Start A New Game With These Players</v-btn>
			</v-col>
		</v-row>
		<v-row>
			<random-players></random-players>
		</v-row>
	</v-container>
</template>

<script>
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import Player from '../components/PlayerComp.vue';
import RandomPlayers from '../components/RandomPlayers.vue';
import firestore from '../firebase';

export default {
	data: () => ({
		playerName: '',
		showError: false,
		errorMessage: '',
		gameName: 'UnnamedGame',
	}),
	components: {
		Player,
		RandomPlayers,
	},
	methods: {
		/* Add a new player to the list, this is done directly to the firestore */
		addPlayer() {
			this.clearError();
			if (this.playerName && this.playerName.length > 1) {
				return this.userDocRef
					.update({
						players: firebase.firestore.FieldValue.arrayUnion({
							id: this.playerId,
							name: this.playerName,
							editing: false,
						}),
					})
					.then(() => {
						this.playerName = '';
					})
					.catch((error) => {
						console.log('error adding player', error);
					});
			}
			return this.error('A name must be at least 2 characters');
		},
		error(message) {
			this.errorMessage = message;
			this.showError = true;
		},
		clearError() {
			this.showError = false;
		},
		/* Start a new game with the current list of players, this is created directly on the firestore */
		newGame() {
			const gamePlayers = this.players.map((obj) => ({ ...obj, scores: [] }));
			this.userDocRef
				.collection('games')
				.add({
					gameName: this.gameName,
					gamePlayers,
					created: firebase.firestore.Timestamp.now(),
				})
				.then((docRef) => {
					this.userDocRef
						.collection('games')
						.doc(docRef.id)
						.update({ gameId: docRef.id });
					this.$router.push(`/games/${docRef.id}`);
				})
				.catch((error) => console.log('error adding new game:', error));
		},
	},
	computed: {
		user() {
			if (this.$store.getters.user) {
				return this.$store.getters.user;
			}
			return null;
		},
		username() {
			if (this.user) {
				return this.$store.getters.username;
			}
			return '';
		},
		players() {
			if (this.user) {
				return this.$store.getters.players;
			}
			return [];
		},
		playerId() {
			if (this.players && this.players.length > 0) {
				return this.players[this.players.length - 1].id + 1;
			}
			return 0;
		},
		nextGameId() {
			return this.$store.getters.nextGameId;
		},
		uid() {
			return this.$store.getters.uid;
		},
		userDocRef() {
			return firestore.collection('users').doc(this.uid);
		},
		mainColor() {
			return this.$store.getters.mainColor;
		},
	},
};
</script>

<style lang="scss">
.players-list {
	list-style: none;
	padding: 0;
	& .player-name:nth-child(even) {
		background-color: #eee;
	}
}
.player-name {
	position: relative;
	.player-control {
		display: inline-block;
		position: absolute;
		right: 1.2rem;
		span {
			cursor: pointer;
			color: blue;
			&:last-child {
				margin-left: 1rem;
			}
		}
	}
}
</style>
