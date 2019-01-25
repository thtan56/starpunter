// Vue.component('navbars', {
<template>
  <section class="menu">
    <div v-if="role === 'manager'"><manager></manager></div>
    <div v-else-if="role === 'customer'"><customer></customer></div>
    <div v-else-if="role === 'guest'"><navpublic></navpublic></div>
  </section>
</template>
<script>
import store from '../store';
import manager from './NavBarManager.vue';
import customer from './NavBarCustomer.vue';
import navpublic from './NavBarPublic.vue';
export default {
  name: 'navbars',
  components: { store, navpublic, customer, manager },
  computed: {
    role() {
      return this.$store.state.loginUser.role;
    },
  }
};
</script>
