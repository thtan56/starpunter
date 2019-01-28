// const homePools=Vue.component('homepools', { 
<template>
<div>
  <v-tabs v-model="tabs" color="cyan" dark slider-color="yellow">   
    <v-tab v-for="filter in quorumList" :key="filter.pool_type">{{ filter.pool_type }}</v-tab>
    <v-spacer></v-spacer>
      <v-btn flat>Week Pools</v-btn>
      <v-tab-item v-for="filter in quorumList" :key="filter.pool_type">
        <v-data-table :pagination.sync="pagination" :headers="headers" :items="filtered2Items(filter.pool_type)"> <!-- 2nd filter -->
          <template slot="items" slot-scope="props">
              <td>{{ props.item.organiser}}/{{ props.item.round }}</td>
              <td>{{ props.item.entry_cost}}</td> 
              <td>{{ props.item.start | moment}} - {{ props.item.end_dt | moment}}</td>
              <td :style="{backgroundColor: (props.item.entrants > props.item.entry_quorum ? 'red' : 'transparent')}">
                  {{ props.item.entry_quorum}}:{{ props.item.entrants}}</td>
              <td>{{ props.item.pool_prize}}</td>
              <td>{{ props.item.payout}}</td>
              <td>{{ props.item.pool_name}}</td>
              <td>{{ props.item.id}} / {{ props.item.status}}</td>
              <td>
                <v-btn flat color="primary" @click="showDetails(props.item)">Enter</v-btn>
              </td>
          </template>
        </v-data-table>
      </v-tab-item>
    </v-tabs>            
  </div>
</template>

<script>
import store from '../store';
import moment from 'moment';
export default {
  name: 'homePools',   // component name
  props: { selected: {type: Array},    today: {type: String}  },
  components: { store },   // 2
  data () {
    return {
      tabs: '',
      pagination: {  rowsPerPage: 10 }, 
      quorumList: [ { pool_type: 'head2head' }, { pool_type: 'group' }  ],
      headers: [ { text: 'Organiser/Round', value: 'organiser' } 
                ,{ text: 'Entry Cost', value: 'entry_cost' }
                ,{ text: 'Start/End Date', value: 'start' }                 
                ,{ text: 'Entry Quorum/Entrants', value: 'entry_quorum' }
                ,{ text: 'Pool Prize', value: 'pool_prize' }
                ,{ text: 'Payout', value: 'payout' }
                ,{ text: 'Plan Name', value: 'pool_name' } 
                ,{ text: 'Id / Status', value: 'id' }],
      pools: [],
      filtered: [],
      filtered2:[],
      username:''        
    }
  },
  computed: {
    role() { return this.$store.state.loginUser.role; },
    vbal() { return this.$store.state.loginUser.vcash; },
    pageTitle() { return this.organiser + ' Pools for the game' },
  },
  watch: { 
    selected: {
      handler: function (newValue) {
        console.log("202) selected change", newValue);
        this.getOrgPools();  
      }, deep: true }, 
    today (newVal, oldVal)  { 
      console.log("201) today change", newVal);
      this.getOrgPools(); 
    }  
  },  
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },
  methods: {
    filtered2Items (key) {  // 2) pool_type
      const res = this.filtered;
      if (key) { 
        if (key === 'Search') { return res };
        return this.filtered.filter(pool => pool.pool_type === key) 
      };
      return res
    },
    showDetails(item) { 
      console.log("101) HP:showDetails: item", item);
      if (this.username==="") 
           this.$router.push({name:'homeGames', params: {username: "demo", poolData: item} })
      else this.$router.push({name:'homeGames', params: {username: this.username, poolData: item} });     
    },
    //=================================================================
    getOrgPools: function () {
      console.log("20) homepools: getOrgPools:"+this.selected+":"+this.today);
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getOrgsPools", data: { organisers: this.selected, today: this.today } };  
      this.$http.post('/php/apiPool.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }
        }).then(response => {    
            console.log("22) HP:OrgsPools:response.body:", response.body);
            if (response.body === null) { this.pools=[];
            } else {              
              this.pools = response.body.data;
              this.filtered = _.filter(this.pools, (pool) => _.includes(this.selected, pool.organiser) );
            };
            console.log("23) HP:OrgsPools:filtered:", this.selected, this.filtered);
       },   response => { this.result = 'Failed to load data to server.';
      });
    },
  },    // end of methods
  beforeMount(){
    this.username=this.$store.state.loginUser.username;
    console.log("1) HP.vue:beforeMount this.username", this.username); // undefined - 1st time
    this.getOrgPools(); }
};
</script>
