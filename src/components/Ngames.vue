// const nGames = Vue.component('gamecomponent', {
<template>
  <v-content>
    <topmenu></topmenu>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex d-flex xs12 sm12><v-card><v-card-text><betNgame></betNgame></v-card-text></v-card></v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import topmenu from './TopMenu.vue';
import betNgame from './BetNgame.vue';
export default {
  name: 'betPools',
  components: { topmenu, betNgame }
};
</script>
