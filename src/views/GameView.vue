<template>
	<v-container>
		<v-row>
			<v-col>
				<router-view></router-view>
				<h2>{{ gameName }}</h2>
				<game-scores :game="game"></game-scores>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import gameScores from '../components/GameScores.vue';

export default {
	data() {
		return {
			gameId: this.$route.params.gameId,
		};
	},
	computed: {
		game() {
			return this.$store.getters.currentGame(this.gameId);
		},
		gamePlayers() {
			if (this.game && this.game.gamePlayers) {
				return this.game.gamePlayers;
			}
			return [];
		},
		gameName() {
			if (this.game) {
				return this.game.gameName;
			}
			return '';
		},
	},
	components: {
		gameScores,
	},
};
</script>

<style></style>
