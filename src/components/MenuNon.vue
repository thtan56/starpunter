// Vue.component('menunon', {
<template>
  <div>
    <v-navigation-drawer temporary v-model="drawer" app>   <!-- without app: appear at the bottom -->
      <v-list>
        <v-list-tile v-for="item in menuItems" :key="item.title"  :to="item.link" router>
          <v-list-tile-action><v-icon>{{ item.icon }}</v-icon></v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dark class="primary">
      <v-toolbar-side-icon @click.native.stop="drawer = !drawer" class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-toolbar-title><router-link to="/" tag="span" style="cursor: pointer">Starpunter</router-link></v-toolbar-title>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in menuItems" :key="item.title" router :to="item.link">
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      {{displayToday}}
      {{displayWeek}}
    </v-toolbar>
  </div>
</template>

<script>
import store from '../store';
export default {
  name: 'menunon',
  components: { store },   // 2
  data: () => { return { drawer: false } },
  computed: {
    menuItems() {
      let menuItems = [
        { icon: 'home', title: 'Home',    link:'/'},
        { icon: 'face', title: 'Sign up', link:'/signup'},
        { icon: 'lock_open', title: 'Sign in', link:'/login'} ];
      return menuItems;
    },
    displayToday() { return this.$store.state.sport.today; },  
    displayWeek() { return 'Week:'+moment().format('W') }  
  },  
};
</script>
