// const statement = {
<template>
  <v-content>
    <topmenu></topmenu>
    <soacomponent :username="username"></soacomponent>
  </v-content>
</template>

<script>
import topmenu from './TopMenu.vue';
import soacomponent from './SoaComponent.vue';
export default {
  name: 'statement',
  components: { topmenu, soacomponent },
  data () { return { username: '' } },  
  created(){
    this.username = this.$store.state.loginUser.username;
    console.log("10) created:",this.username);
  }
};
</script>
