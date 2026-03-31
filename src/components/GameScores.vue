<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="game-players-list d-flex flex-wrap">
          <v-card class="game-player mb-6" v-for="player in gamePlayers" :key="player.name">
            <player-scores :player="player" />
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import playerScores from './PlayerScores.vue';

export default {
  props: ['game'],
  computed: {
    gamePlayers() {
      if (this.game) {
        return this.game.gamePlayers;
      }
      return [];
    },
  },
  components: {
    playerScores,
  },
};
</script>

<style scoped lang="scss">
.game-players-list {
  justify-content: space-around;
}
</style>
