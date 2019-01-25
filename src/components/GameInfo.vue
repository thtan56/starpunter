// Vue.component('gameinfo', {         
<template>
  <div>
    <v-toolbar flat color="pink">
      <v-toolbar-title><slot></slot></v-toolbar-title>
    </v-toolbar>
    <div class="container-fluid">
      <h1>{{gameData.orgweek}}</h1>
      <div class="row">
        <div class="col-md-6">
          <div class="row">
            <div class="col-md-4"></div>
            <div class="col-md-4"><strong>Home</strong></div>
            <div class="col-md-4"><strong>Away</strong></div>
            <div class="col-md-4"><p class="text-right"><strong>Team</strong></p></div>
            <div class="col-md-4">{{gameData.home_team}}</div>
            <div class="col-md-4">{{gameData.away_team}}</div>
            <div class="col-md-4"><p class="text-right"><strong>Score</strong></p></div>
            <div class="col-md-4">{{gameData.home_score}}</div>
            <div class="col-md-4">{{gameData.away_score}}</div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="row">
            <div class="col-md-6"><p class="text-right"><strong>Date</strong></p></div>
            <div class="col-md-6">{{gameData.start | moment}}</div>
            <div class="col-md-6"><p class="text-right"><strong>Status</strong></p></div>
            <div class="col-md-6">{{gameData.status}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'gameinfo',
  props: { gameData: {type: Object } }, 
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },  
};
</script>
