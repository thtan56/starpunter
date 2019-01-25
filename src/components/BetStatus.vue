// const betStatus = Vue.component('betstatuscomponent', {   // ticket_games
<template>
  <v-content>
    <topmenu></topmenu>
    <v-container fluid grid-list-lg>
      <v-layout row wrap><v-flex d-flex xs12 sm12><v-card><v-card-text>

  <v-container fluid grid-list-md>
    <v-layout column>
      <v-toolbar color="pink" dark><v-toolbar-title>Bet Status/Result(Read Only)</v-toolbar-title></v-toolbar>
      <v-container fluid grid-list-md>
        <v-flex xs12>
          <v-card dark color="primary">
            <v-card-title>Bet Status History<v-spacer></v-spacer>
              <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
            </v-card-title>     
            <v-data-table :headers="headers" :items="tgames" :search="search"> 
              <template slot="items" slot-scope="props">                            
                <td class="text-xs-left">{{ props.item.username }}</td>
                <td class="text-xs-left">{{ props.item.organiser }}/{{ props.item.round }}</td>
                <td class="text-xs-left">{{ props.item.home_team }}/{{ props.item.away_team }}/
                                         {{ props.item.start | moment }}</td>
                <td class="text-xs-left">{{ props.item.bet_team }} / {{ props.item.bet_date | moment }}</td>
                <td class="text-xs-left">{{ props.item.ticket_id }}</td>
                <td>{{ props.item.status }}</td>
                <td>{{ props.item.game_id }}</td>
                <td>{{ props.item.id }}</td>
                <td>
                  <template v-if="props.item.status === 'pending'">      
                     <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                  </template>
                </td>
              </template>
               <template slot="footer">
                <td colspan=2><strong>My Balance</strong></td>
                <td>Cash Balance:{{ $store.state.loginUser.cash | currency(2) }}</td>
                <td colspan=2>Virtual Cash Balance:{{ $store.state.loginUser.vcash | currency(2) }}</td>
               </template>
            </v-data-table>    
          </v-card>
        </v-flex>   
      </v-container>
    </v-layout>
  </v-container>    
        
      </v-card-text></v-card></v-flex></v-layout>
    </v-container>
  </v-content>              
</template>

<script>
import topmenu from './TopMenu.vue';

export default {
  name: 'betStatus',
  components: { topmenu },   // 2
  data () {
    return {
      result: '',
      error: '',
      valid: false,
      editedIndex: -1,
      editedItem: { username: '', organiser: '', round: '', home_team: '', away_team: '', bet_team: ''
          ,bet_date: '', start: '', status: '', ticket_id:'', gid: '', id: ''},   // id=game_id, game_date missing
      pagination: {},
      headers: [   
        { text: 'Username', value: 'username'},
        { text: 'Organiser/Round', value: 'organiser'},
        { text: 'Home/Away Team/Date', value: 'home_team'},        
        { text: 'Bet Team/Date', value: 'bet_team' },
        { text: 'Ticket Id', value: 'ticket_id' },
        { text: 'Status', value: 'status' },        
        { text: 'Game Id', value: 'game_id' },  
        { text: 'Id', value: 'id' }      
      ],
      tgames: [],
      search: '',
      username: ''
    }
  },
  filters: {
    moment: function (date) { return moment(date).format('L'); }
  },
  methods: {
    deleteItem: function(item){
      this.editedItem       = item;
      this.editedItem.gid   = item.id;
      this.editedItem.tid   = item.ticket_id;    
      console.log("29) deleteItem", this.editedItem);
      var r = confirm("Are you sure to delete this item ("+item.id+':'+item.ticket_id
        +" game:"+item.home_team + " vs "+ item.away_team+ ")?");
      if(r==true) {
        this.result = 'Deleting data to server...';
        var postdata = { op: "delete", data: this.editedItem};
        this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata),{ headers: { 'Content-Type': 'application/json' }
          }).then(response => {
                                this.getAllData();    // refresh datatable
          },      response => { this.result = 'Failed to delete data.';
        });
      }
    },
    getAllData: function () {
      this.result = 'Getting data from server...';
      var postdata = { op: "getTicketGamesByUser", username: this.username };
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.tgames = response.body.data;
                              console.log(this.tgames);
        },      response => { this.result = 'Failed to load data to server.';
      });
    }
  },   // end of methods
  beforeMount(){
    console.log("21) beforeMount:");
    this.username = this.$store.state.loginUser.username;
    this.getAllData(); }
  };
  </script>
