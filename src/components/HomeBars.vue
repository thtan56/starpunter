// const HomeBarsComponent = Vue.component('homebars', {
<template>
  <header>
    <div v-if="!customer"><menunon></menunon></div>
    <div v-else><menucust></menucust></div>
  </header>
</template>

<script>
import store from '../store';
import menunon from './MenuNon.vue';    //1
import menucust from './MenuCust.vue';  

export default {
  name: 'homebars',
  components: { store, menunon, menucust },   // 2
  computed: {
    customer() { return this.$store.state.loginUser.username === "" ? false : true },
  },  
};
</script>
