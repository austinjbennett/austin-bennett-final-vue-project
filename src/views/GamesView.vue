<template>
	<v-container>
		<v-row>
			<v-col>
				<v-list v-if="games.length > 0" class="games-list">
					<v-list-item v-for="game in games" :key="game.gameId" class="game">
						<router-link :to="'/games/' + game.gameId" v-mainColor:text="mainColor">{{ game.gameName }}</router-link>
					</v-list-item>
				</v-list>
				<v-card v-else>You don't have any games</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	computed: {
		games() {
			return this.$store.getters.games;
		},
		mainColor() {
			return this.$store.getters.mainColor;
		},
	},
};
</script>

<style scoped lang="scss">
.games-list {
	.game:nth-child(even) {
		background-color: #eee;
	}
}
</style>
