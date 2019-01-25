// userGames is the defined component in vue-router path
// full layout with top & side nav bars
// const betGames = Vue.component('BetGamesComponent', {
<template>
  <v-content>
    <homebars></homebars>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex d-flex xs12 sm12><v-card><v-card-text><betOgame2 :ticketid="ticketid"></betOgame2></v-card-text></v-card></v-flex>
      </v-layout>
    </v-container>
  </v-content>
  </template>

<script>
import homebars from './HomeBars.vue';    // 1
export default {
  name: 'betGames',
  components: { homebars },
  props: { 'ticketid': {type: String} }
};
</script>
