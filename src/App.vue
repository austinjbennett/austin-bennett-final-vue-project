<template>
  <v-app>
    <v-app-bar id="nav-desktop" :color="mainColor" class="app-header" :style="{ '--main-color': mainColor }">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click="navDrawer = !navDrawer" class="d-md-none" />
      </template>
      <v-app-bar-title>Virtual Scorecard</v-app-bar-title>
      <template v-slot:append>
        <div class="hidden-sm-and-down d-flex align-center">
          <router-link
            v-for="item in navItems"
            :key="item.title"
            :to="item.route"
            class="text-decoration-none"
          >
            <div v-if="item.conditional" class="menu-link">
              <v-btn variant="text" :prepend-icon="item.icon">
                {{ item.title }}
              </v-btn>
            </div>
          </router-link>
          <v-btn
            v-if="userAuthenticated"
            @click="signOut"
            variant="text"
            prepend-icon="mdi-logout"
          >
            Sign Out
          </v-btn>
        </div>
      </template>
      <v-spacer />
    </v-app-bar>

    <v-navigation-drawer v-model="navDrawer" app>
      <v-list>
        <v-list-item>
          <v-list-item-title class="text-h6">Virtual Scorecard</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-divider />

      <v-list nav>
        <router-link
          v-for="item in navItems"
          :key="item.title"
          :to="item.route"
          class="text-decoration-none"
        >
          <div v-if="item.conditional" class="menu-link">
            <v-list-item :prepend-icon="item.icon" :title="item.title" />
          </div>
        </router-link>
        <v-list-item
          v-if="userAuthenticated"
          @click="signOut"
          prepend-icon="mdi-logout"
          title="Sign Out"
        />
      </v-list>
      <div v-if="user" class="pa-4">
        <span class="text-body-2">{{ username }}</span>
      </div>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </v-container>
    </v-main>
  </v-app>
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

header.v-toolbar {
  flex: 0;
}

/* Basic app bar styling to match old toolbar */
.app-header {
  background-color: var(--main-color, #1976d2) !important;
}

.app-header .v-app-bar-title {
  color: white !important;
}

.app-header .v-btn {
  color: white !important;
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
