// const TopMenu=Vue.component('topmenu', {
<template>
  <div>
    <v-navigation-drawer temporary v-model="drawer" app>   <!-- without app: appear at the bottom -->
      <v-list>
        <leftsidebar></leftsidebar>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar dark class="primary">
      <v-toolbar-side-icon @click.native.stop="drawer = !drawer" class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">Home</router-link>
      </v-toolbar-title>
      
      <topbar></topbar>
      <topsportbar></topsportbar>
      <div v-if="role === 'manager'">
        <topadmbar></topadmbar>
      </div>
    </v-toolbar>
  </div>
</template>

<script>
import store from '../store';
import topbar from './TopBar.vue';    //1
import topadmbar from './TopAdmBar.vue';    
import topsportbar from './TopSportBar.vue';
import leftsidebar from './LeftSideBar.vue';
export default {
  name: 'topmenu',
  components: { store, topbar, topadmbar, topsportbar, leftsidebar },   // 2
  data () { return { drawer: false } },
  computed: {
    role() { return this.$store.state.loginUser.role; },
  }        
};
</script>
