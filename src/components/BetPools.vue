// const BetPools = Vue.component('contestants', {
<template>
  <v-content>
    <topmenu></topmenu>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex d-flex xs12 sm12><v-card><v-card-text><poolPlayers></poolPlayers></v-card-text></v-card></v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import topmenu from './TopMenu.vue';
import poolPlayers from './PoolPlayers.vue';
export default {
  name: 'betPools',
  components: { topmenu, poolPlayers }
};
</script>
