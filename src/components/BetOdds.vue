// const BetOdds = Vue.component('betodds', {
<template>
  <v-content>
    <topmenu></topmenu>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex d-flex xs12 sm12><v-card><v-card-text><betOgame></betOgame></v-card-text></v-card></v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import topmenu from './TopMenu.vue';
import betOgame from './BetOgame.vue';
export default {
  name: 'betOdds',
  components: { topmenu, betOgame }
};
</script>
