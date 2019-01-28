// Vue.component('menucust', {
<template>
  <div>
    <v-navigation-drawer temporary v-model="drawer" app>   <!-- without app: appear at the bottom -->
      <v-list><leftsidebar></leftsidebar></v-list>
    </v-navigation-drawer>
    <v-toolbar dark class="primary">
      <v-toolbar-side-icon @click.native.stop="drawer = !drawer" class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-toolbar-title><router-link to="/" tag="span" style="cursor: pointer">Home</router-link></v-toolbar-title>
      <topbar></topbar>
      <topsportbar></topsportbar>
      <v-spacer></v-spacer>
      <div v-if="role === 'manager'"><topadmbar></topadmbar></div>
      Hello {{displayUser}}
      <v-btn flat color="yellow">vcash:{{vbal}}</v-btn>
      {{displayToday}}
      {{displayWeek}}
    </v-toolbar>
  </div>
</template>

<script>
import store from '../store';
import moment from 'moment';
import leftsidebar from './LeftSideBar.vue';
import topbar from './TopBar.vue';    //1
import topadmbar from './TopAdmBar.vue';    
import topsportbar from './TopSportBar.vue';

export default {
  name: 'menucust',
  components: { store, leftsidebar, topbar, topadmbar, topsportbar },   // 2
  data: () => { return { drawer: false } },
  computed: {
    role() { return this.$store.state.loginUser.role; },
    vbal() { return this.$store.state.loginUser.vcash; },
    displayToday() { return this.$store.state.sport.today; },
    displayWeek() { return 'Week:'+moment().format('W') },  
    displayUser() { return this.$store.state.loginUser.username; },   
  },
};
</script>
