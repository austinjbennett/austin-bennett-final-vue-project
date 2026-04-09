<template>
  <div>
    <transition-group name="slide">
      <li v-for="(player, index) in players" :key="player.id" class="player-name pa-3">
        <span v-if="player.editing === false">{{ player.name }}</span>
        <v-text-field
          @keyup.enter="doneEdit(player, index)"
          @keyup.esc="cancelEdit(index)"
          v-model="player.name"
          v-if="player.editing === true"
        />
        <v-btn @click="doneEdit(player, index)" v-if="player.editing === true" class="green">Finish</v-btn>
        <v-btn @click="cancelEdit(index)" v-if="player.editing === true" class="secondary ml-3">Cancel</v-btn>
        <div class="player-control">
          <span class="edit-player" @click="editPlayer(player, index)" @keypress="editPlayer(player, index)">Edit</span>
          <span class="remove-player" @click="removePlayer(index)" @keypress="removePlayer(index)">Remove</span>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
import firestore from '../firebase';

export default {
  data: () => ({
    playerName: '',
  }),
  methods: {
    removePlayer(index) {
      this.$store.dispatch('removePlayer', index);
    },
    editPlayer(player, index) {
      this.playerName = player.name;
      this.players[index].editing = true;
    },
    cancelEdit(index) {
      this.players[index].name = this.playerName;
      this.players[index].editing = false;
      this.playerName = '';
    },
    doneEdit(player, index) {
      const trimmedName = player.name.trim();
      this.players[index].editing = false;
      this.$store.dispatch(
        'editPlayer',
        {
          player: {
            id: player.id,
            name: trimmedName,
            editing: false,
          },
          index,
        },
      );
      this.playerName = '';
      if (!trimmedName) {
        this.removePlayer(index);
      }
    },
  },
  computed: {
    players() {
      if (this.$store.getters.user) {
        return this.$store.getters.players;
      }
      return [];
    },
    userDocRef() {
      return firestore.collection('users').doc(this.$store.getters.uid);
    },
    mainColor() {
      return this.$store.getters.mainColor;
    },
  },
};
</script>
<style scoped lang="scss">
//
</style>
