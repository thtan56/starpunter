// Vue.component('poolinfo', {
<template>
  <div>
    <v-card color="blue-grey" dark tile flat>
      <v-toolbar color="pink" dark>
        <v-toolbar-title><slot></slot></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn flat class="white--text">Sport:{{poolData.organiser}} - {{poolData.round}}</v-btn>            
      </v-toolbar> 
      <v-card-text>
        <v-layout wrap>
          <v-flex xs3><v-text-field label="Entry Cost"   v-model="poolData.entry_cost" readonly></v-text-field></v-flex>
          <v-flex xs3><v-text-field label="Entry Quorum" v-model="poolData.entry_quorum" readonly></v-text-field></v-flex>
          <v-flex xs3><v-text-field label="Entrants"     v-model="poolData.entrants" readonly></v-text-field></v-flex>
          <v-flex xs3><v-text-field label="Pool Prize"   v-model="poolData.pool_prize" readonly></v-text-field></v-flex>
          <v-flex xs3><v-text-field label="Pool Type"    v-model="poolData.pool_type" readonly></v-text-field></v-flex>
          <v-flex xs3><v-text-field label="Pool Name"    v-model="poolData.pool_name" readonly></v-text-field></v-flex>
          <v-flex xs3><v-text-field label="Payout"       v-model="poolData.payout" readonly></v-text-field></v-flex>
          <v-flex xs3><v-text-field label="Status"       v-model="poolData.status" readonly></v-text-field></v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  name: 'poolinfo',
  props: {  poolData: {type: Object} }
};
</script>
