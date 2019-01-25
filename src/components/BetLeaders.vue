// const BetLeaders = Vue.component('betleaders', {
<template>
  <v-content>
    <topmenu></topmenu>
    <betresults></betresults>
  </v-content>
</template>

<script>
import topmenu from './TopMenu.vue';
import betresults from './BetResults.vue';

export default {
  name: 'betLeaders',
  components: { topmenu, betresults }
};
</script>
