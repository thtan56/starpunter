// const nblBet = Vue.component('nblComponent', {
<template>
  <v-content>
    <homebars></homebars>
    <h2>Basketball</h2>    
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex d-flex xs12 sm4>
          <v-card color="purple" dark>
            <v-card-title primary class="title">My Betting Records</v-card-title>
            <v-card-text><betComponent></betComponent></v-card-text>
          </v-card>
        </v-flex>
        <v-flex d-flex xs12 sm8>
          <v-card color="blue lighten-2" dark>  <!-- white table (without dark)  -->
            <v-card-title class="title">NBL 2018 Schedule</v-card-title>
            <v-card-text><schComponent organiser="NBL"></schComponent></v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>
<script>
import homebars from './HomeBars.vue';
import betComponent from './BetComponent.vue';
import schComponent from './SchComponent.vue';
export default {
  name: 'nblBet',
  components: { homebars, betComponent, schComponent },
};
</script>
