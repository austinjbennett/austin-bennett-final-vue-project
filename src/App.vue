<template>
	<div id="app">
		<v-app>
			<v-toolbar id="nav-desktop" v-mainColor="mainColor" dark>
				<v-app-bar-nav-icon @click="navDrawer = !navDrawer" class="d-md-none"></v-app-bar-nav-icon>
				<v-toolbar-title>Virtual Scorecard</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-toolbar-items class="hidden-sm-and-down">
					<router-link v-for="item in navItems" :key="item.title" :to="item.route"
					>
						<div v-if="item.conditional" class="menu-link">
							<v-list-item link>
								<v-list-item-icon>
									<v-icon>{{ item.icon }}</v-icon>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title>{{ item.title }}</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</div>
					</router-link>
					<a href="#" v-if="userAuthenticated" @click.prevent="signOut">
						<v-list-item link>
							<v-list-item-icon>
								<v-icon>mdi-login</v-icon>
							</v-list-item-icon>
							<v-list-item-content>
								<v-list-item-title>Sign Out</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
					</a>
				</v-toolbar-items>
			</v-toolbar>
			<v-navigation-drawer id="nav" v-model="navDrawer" app floating>
				<v-list-item>
					<v-list-item-content>
						<v-list-item-title class="title">Virtual Scorecard</v-list-item-title>
					</v-list-item-content>
				</v-list-item>

				<v-divider></v-divider>

				<nav>
					<v-list dense nav>
						<router-link v-for="item in navItems" :key="item.title" :to="item.route">
							<div v-if="item.conditional" class="menu-link">
								<v-list-item link>
									<v-list-item-icon>
										<v-icon>{{ item.icon }}</v-icon>
									</v-list-item-icon>
									<v-list-item-content>
										<v-list-item-title>{{ item.title }}</v-list-item-title>
									</v-list-item-content>
								</v-list-item>
							</div>
						</router-link>
						<a href="#" v-if="userAuthenticated" @click.prevent="signOut">
							<div class="menu-link">
								<v-list-item link>
									<v-list-item-icon>
										<v-icon>mdi-login</v-icon>
									</v-list-item-icon>
									<v-list-item-content>
										<v-list-item-title>Sign Out</v-list-item-title>
									</v-list-item-content>
								</v-list-item>
							</div>
						</a>
					</v-list>
					<span v-if="user">{{ username }}</span>
				</nav>
			</v-navigation-drawer>
			<transition name="fade" mode="out-in">
				<router-view />
			</transition>
		</v-app>
	</div>
</template>

<script>
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const auth = firebase.auth();

export default {
	/* Set a listener to update the state whenever the firebase authState changes */
	beforeCreate() {
		auth.onAuthStateChanged((currentUser) => {
			// console.log('onAuthStateChange Triggered');
			if (currentUser) {
				this.$store.dispatch('bindUserRef');
				this.$store.dispatch('bindGamesRef');
				this.$store.dispatch('setUid', currentUser.uid);
				this.$store.dispatch('setUsername', currentUser.displayName);
			} else {
				this.$store.commit('resetState');
			}
		});
	},
	data() {
		return {
			navDrawer: false,
		};
	},
	computed: {
		user() {
			return this.$store.getters.user;
		},
		username() {
			return this.$store.getters.username;
		},
		navItems() {
			return [
				{
					title: 'Home',
					route: '/',
					icon: 'mdi-home',
					conditional: true,
				},
				{
					title: 'Players',
					route: '/players',
					icon: 'mdi-account-group',
					conditional: this.authenticated(),
				},
				{
					title: 'Games',
					route: '/games',
					icon: 'mdi-cards-playing-outline',
					conditional: this.authenticated(),
				},
				{
					title: 'Sign In',
					route: '/signin',
					icon: 'mdi-login',
					conditional: this.authenticated() === false,
				},
				{
					title: 'Sign Up',
					route: '/signup',
					icon: 'mdi-account-plus',
					conditional: this.authenticated() === false,
				},
			];
		},
		/* Check if the user is authenticated to display the correct navigation items */
		userAuthenticated() {
			return this.authenticated();
		},
		mainColor() {
			return this.$store.getters.mainColor;
		},
	},
	methods: {
		authenticated() {
			if (this.user) {
				return true;
			}
			return false;
		},
		signOut() {
			this.$store.dispatch('signOut');
		},
	},
};
</script>

<style lang="scss">
#app {
	font-family: "Avenir", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

#nav-desktop {
	.v-list-item__icon {
		margin-right: 0.6rem;
	}
	a {
		&:hover {
			text-decoration: none;
		}

		&.router-link-exact-active,
		&.router-link-exact-active .v-list-item__icon i {
			color: #333 !important;
		}
	}
}

#nav {
	a {
		&:hover {
			text-decoration: none;
		}
		&.router-link-exact-active,
		&.router-link-exact-active .v-list-item__icon i {
			color: #42b983;
		}
		.v-list-item__title {
			text-align: left;
			font-weight: bold;
		}
	}
}

.v-toolbar__content {
	height: auto !important;
}
header.v-toolbar {
	flex: 0;
}

/* Fade Animation */
.fade-leave-active {
	transition: opacity 0.1s ease;
	opacity: 0;
}
.fade-leave {
	opacity: 1;
	transform: translateX(0);
}
.fade-enter {
	opacity: 0;
}
.fade-enter-active {
	transition: opacity 0.1s ease;
}
.fade-move {
	transition: transform 1s;
}

/* Slide Animation */
.slide-enter-active {
	animation: slide-in 0.5s forwards;
}
.slide-leave-active {
	animation: slide-out 0.5s forwards;
}
@keyframes slide-in {
	from {
		transform: translateY(3rem);
	}
	to {
		transform: translateY(0);
	}
}
@keyframes slide-out {
	from {
		transform: translateY(0);
		opacity: 1;
	}
	to {
		transform: translateY(1rem);
		opacity: 0;
	}
}
</style>
