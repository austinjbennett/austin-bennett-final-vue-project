<template>
	<v-container class="home pa-6">
		<h1>Welcome to Digital Scorecard {{ username }}!</h1>
		<h3>Here you can track scores for card games, or any other kind of game.</h3>
		<v-btn class="start-btn mt-4 white--text" v-mainColor="mainColor" @click="getStarted">Get Started</v-btn>
		<v-card class="mt-9">
			<v-card-title>Pick your favorite color:</v-card-title>
			<v-row class="d-flex px-6">
				<v-col cols="12" sm="3">
					<v-card class="color-card red" @click="setColor(red)"></v-card>
				</v-col>
				<v-col cols="12" sm="3">
					<v-card class="color-card green" @click="setColor(green)"></v-card>
				</v-col>
				<v-col cols="12" sm="3">
					<v-card class="color-card blue" @click="setColor(blue)"></v-card>
				</v-col>
				<v-col cols="12" sm="3">
					<v-card class="color-card orange" @click="setColor(orange)"></v-card>
				</v-col>
			</v-row>
		</v-card>
	</v-container>
</template>

<script>
// @ is an alias to /src
// import store from '../store';

export default {
	name: 'homeView',
	data() {
		return {
			red: '#b60000',
			green: '#0a9300',
			blue: '#1976d2',
			orange: '#d87b02',
		};
	},
	computed: {
		user() {
			return this.$store.getters.user;
		},
		username() {
			return this.$store.getters.username;
		},
		mainColor() {
			return this.$store.getters.mainColor;
		},
	},
	components: {},
	methods: {
		getStarted() {
			if (this.user) {
				this.$router.push('/players');
			} else {
				this.$router.push('/signup');
			}
		},
		setColor(color) {
			this.$store.dispatch('setColor', color);
		},
	},
};
</script>
<style scoped>
.color-card {
	height: 4rem;
}
.red {
	background-color: #b60000;
}
.green {
	background-color: #0a9300;
}
.blue {
	background-color: #1976d2;
}
.orange {
	background-color: #d87b02;
}
.start-btn {
	transition: background-color 0.3s
}

</style>
