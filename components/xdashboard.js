const MenuComponent = Vue.component('dashboard', {
  template: /* syntax: html */`
  <v-app>
  <main>
    <v-navigation-drawer temporary v-model="drawer" app>   <!-- without app: appear at the bottom -->
      <v-list>
        <v-list-tile v-for="item in menuItems" :key="item.title"  :to="item.link" router>
          <v-list-tile-action><v-icon>{{ item.icon }}</v-icon></v-list-tile-action><v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
        <leftsidebar></leftsidebar>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar dark class="primary">
      <v-toolbar-side-icon @click.native.stop="drawer = !drawer" class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-toolbar-title><router-link to="/" tag="span" style="cursor: pointer">Starpunter</router-link></v-toolbar-title>
      <topbar></topbar>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in menuItems" :key="item.title" router :to="item.link"><v-icon left dark>{{ item.icon }}</v-icon>{{ item.title }}</v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <router-view></router-view>
  </main>
  </v-app>
  `,
  data: () => {
    return {
      drawer: false,
//      menuItems: [
//        { icon: 'face', title: 'Sign up', link:'/signup'},
//        { icon: 'lock_open', title: 'Sign in', link:'/login'},
//        { icon: 'lock_open', title: 'Log Out', link:'/login'}
//      ],
      username: ''
    }
  },
  computed: {
    menuItems() {
      let menuItems = [
        { icon: 'face', title: 'Sign up', link:'/signup'},
        { icon: 'lock_open', title: 'Sign in', link:'/login'}
      ];
      if (!this.userIsAuthenticated) {
        console.log("1002) menuItems>this.userIsAuthenticated-true");
        menuItems = [
          { icon: 'supervisor_account', title: 'View Meetups', link:'/meetups'},
          { icon: 'room', title: 'Organize Meetup', link:'/meetup/new'},
          { icon: 'person', title: 'Profile', link:'/profile'}
        ];
      };
      console.log("1003) menuItems", menuItems);
      return menuItems;
    },
    userIsAuthenticated() {
      console.log("1001) userIsAuthenticated", this.username);
      return this.username === "thtan99"
    }
  },
  methods: {
    login() { alert("LOGIN");},
    logout() { alert("LOGOUT");},
  },
  created(){  
    this.username = this.$store.state.loginUser.username;
    console.log("999) dashboard.js-created-username:", this.username);
  }
});
