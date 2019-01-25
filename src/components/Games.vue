// Games.vue
<template>
  <div>
   <table class="table table-striped">
      <thead>
        <tr>
          <td>Organiser</td>
          <td>Round</td>
          <td>Home Team</td>
          <td>Away Team</td>
          <td>Start</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in games" :key="item.id">
          <td>{{item.organiser}}</td>
          <td>{{item.round}}</td>
          <td>{{item.home_team}}</td>
          <td>{{item.away_team}}</td>
          <td>{{item.start}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// import MyHeader from './Header.vue';

export default {
  name: 'GameList',
  // components: { MyHeader },
  data () {
    return {
      games: []
    }
  },
  methods: {
    fetchGames () {
      this.result = 'Getting data from server...'
      var postdata = { op: 'getGames' }
      this.$http.post('php/apiGame.php', JSON.stringify(postdata), {
        headers: { 'Content-Type': 'application/json' }
      })
        .then(
          response => { this.games = response.body.data },
          response => { this.result = 'Failed to load data to server.' }
        )
    }
  },
  created () {
    this.fetchGames()
  }  
}
</script>
