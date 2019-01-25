<template>
  <div->
    <v-toolbar dark class="primary">
      <v-toolbar-side-icon @click.native.stop="drawer = !drawer" class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">Home</router-link>
      </v-toolbar-title>      
      <topbar></topbar>                  <!-- 3 -->
      <topsportbar></topsportbar>
      <div v-if="role === 'manager'"><topadmbar></topadmbar></div>
    </v-toolbar>
  </div->
</template>

<script>
import store from '../store';
import topbar from './TopBar.vue';    //1
import topadmbar from './TopAdmBar.vue';    
import topsportbar from './TopSportBar.vue';    
export default {
  name: 'my-header',
  components: { store, topbar, topadmbar, topsportbar },   // 2
  data () {
    return {
      sitename: 'Starpunter',
    }  
  },
  // props: ['cartItemCount'],
  computed: {
    role() { return this.$store.state.loginUser.role }
  },
  methods: {
    showCheckout () { this.$router.push({name: 'Form'}) },
    logoff() {
      const { $router, $store } = this;
      $store.dispatch('LOGOFF').then(() => {
        $router.go({ name: 'login' });
      });
    }
  },
  beforeMount () { 
    console.log('1) Header.vue: beforeMount');
    console.log('3) default user role:', this.$store.state.loginUser.role); 
    var username=this.$store.state.loginUser.username;
    console.log('5) username length:', username.length); 
    if (username.length) {
      console.log('7) Header.vue: already login');   // not zero
    } else {     
      console.log('8) Header.vue: Not login yet');   // zero
    };
    console.log('9) username:', this.$store.state.loginUser.username)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a { text-decoration: none; color: black; }
.router-link-exact-active {color: blue; }
</style>
