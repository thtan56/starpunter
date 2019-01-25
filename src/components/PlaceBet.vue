// const placeBet = Vue.component('dragdropcomponent', {      // stage 2 
<template>
  <v-content>
    <v-container fluid grid-list-lg>
      <v-layout row wrap><v-flex d-flex xs12 sm12><v-card><v-card-text>
        <gameDraggable></gameDraggable>            <!-- in component/servicebet.js (table ticket_games) -->
      </v-card-text></v-card></v-flex></v-layout>
    </v-container>
  </v-content>
</template>


<script>
import gameDraggable from './GameDraggable.vue';    // 1
export default {
  name: 'placeBet',
  components: { gameDraggable }   // 2
};
</script>
