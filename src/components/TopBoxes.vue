// Vue.component('topboxes', {
// "ion ion-ios-gear-outline">
// ion ion-ios-football
// ion ion-ios-cart-outline
// ion ion-ios-people-outline
<template>
  <!-- Info boxes -->
  <div class="row">
    <div class="col">  <!-- bootstrap 4 format -->
      <div class="info-box">
        <span class="info-box-icon bg-aqua"><i class="fa fa-calendar fa-9x"></i></span>
        <div class="info-box-content">
          <span class="info-box-text">
            <router-link :to="{name: 'poolSummary'}">Plans</router-link>
          </span><span class="info-box-number">
          <small>
          <ul id="pools">
            <li v-for="pool in poolcounts" :key="pool.orgweek">
              <b>{{ pool.orgweek }}</b>={{ pool.poolcount }}
            </li>
          </ul>
          </small></span>
        </div></div></div>
    <div class="col">
      <div class="info-box">
        <span class="info-box-icon bg-red"><i class="fa fa-star fa-spin fa-7x"></i></span>
          <!-- i class="fa fa-google-plus"></i -->
        <div class="info-box-content">
          <span class="info-box-text">
            <router-link :to="{name: 'gameSummary'}">Games</router-link>
          </span><span class="info-box-number"><small>
          <ul id="games">
            <li v-for="game in gamecounts" :key="game.orgweek">
              <b>{{ game.orgweek }}</b>={{ game.gamecount }}
            </li>
          </ul>
          </small></span>
        </div></div></div>
    <div class="clearfix visible-sm-block"></div>
    
    <div class="col">
      <div class="info-box">
        <span class="info-box-icon bg-green"><i class="fa fa-heart fa-9x"></i></span>
        <div class="info-box-content">
          <span class="info-box-text">
            <router-link :to="{name: 'ticketSummary'}">Tickets</router-link>            
          </span>
          <span class="info-box-number"><small>
            <ul id="tickets">
              <li v-for="ticket in ticketcounts" :key="ticket.orgweek">
                <b>{{ ticket.orgweek }}</b>={{ ticket.ticketcount }}
              </li>
            </ul>
          </small></span>
        </div></div></div>
    <div class="col">
      <div class="info-box">
        <span class="info-box-icon bg-yellow"><i class="fa fa-user fa-9x"></i></span>
        <div class="info-box-content">
          <span class="info-box-text">
            <router-link :to="{name: 'userSummary2'}">Members</router-link>
          </span>
          <span class="info-box-number">
          {{users.usercount}}
          </span>
        </div></div></div>
  </div>
</template>

<script>
import store from '../store';
// import 'ionicons/css/ionicons.min.css';  // 2.01 - topboxes
export default {
  name: 'topbar',
  components: { store },   // 2
  data () {
    return {
      organisers: ['NBA', 'NBL', 'NFL', 'AFL'],
      today: '',
      gamecounts: [],
      poolcounts: [],
      ticketcounts: [],
      users: {} 
    }
  },
  methods: {  
    getStatistics(data) {
      var mydata      = data.pools;
      var mylist      = alasql('SELECT orgweek, pool_id FROM ? GROUP BY orgweek, pool_id',[mydata]);              
      this.poolcounts = alasql('SELECT orgweek, COUNT(*) AS poolcount FROM ? GROUP BY orgweek',[mylist]);
      //-----------------------------------
      mydata = data.tickets;
      mylist             = alasql('SELECT orgweek, ticket_id FROM ? GROUP BY orgweek, ticket_id',[mydata]);              
      this.ticketcounts  = alasql('SELECT orgweek, COUNT(*) AS ticketcount FROM ? GROUP BY orgweek',[mylist]);   
      //-----------------------------------
      mydata = data.games;
      mylist           = alasql('SELECT orgweek, game_id FROM ? GROUP BY orgweek, game_id',[mydata]);              
      this.gamecounts  = alasql('SELECT orgweek, COUNT(*) AS gamecount FROM ? GROUP BY orgweek',[mylist]);
      this.users = data.users[0];        
    },
    getAllData() {
      var result = 'Getting data from server...';
      var postdata = { op: "getOrgsWeeks", 
                      data: {organisers: this.organisers, today: this.today} };    
      this.$http.post('/php/apiPeriod.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.getStatistics(response.body.data);
             
        },      response => { var result = 'Failed to load data to server.';
      });
    },
  },    // end of methods
  beforeMount(){
    console.log("1) topboxes");
    this.organiser = this.$store.state.sport.organiser;
    this.today = moment().format('YYYY/MM/DD');   
    this.getAllData();                        // get this.pools
  }   
};
</script>
