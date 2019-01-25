// Pools.vue - comppools.js (poolComponent)
<template>
  <div id="poolTable">
  <v-card>
    <v-card-title>Pool Management</v-card-title>
    <v-data-table :headers="headers" :items="bets"> 
      <template slot="items" slot-scope="props">                            
        <td>{{ props.item.pool_id }}</td><td>{{ props.item.username }}</td><td>{{ props.item.count }}</td>
      </template> 
    </v-data-table>                       
  </v-card>       
  </div>
</template>

<script>
import axios from 'axios';
// import MyHeader from './Header.vue';
import store from '../store';
export default {
  name: 'PoolList',
  //props: ['cartItemCount'],
  // components: { MyHeader },
  data () {
    return {
      headers: [ { text: 'Pool#', value: 'pool_id' }, { text: 'Username', value: 'username'}, { text: 'Count', value: 'count'} ],
      bets: [],
      result: '',
    }
  },
  computed: { role() { return this.$store.state.loginUser.role; } },
  methods: {
    getAllData() {
      console.log("10) getAllData");
      let qry = 'database/json_mybet_pools.php';    // summary from bet table
      axios.get(qry)
        .then(response => { 
          this.bets = response.data;
          console.log('11) this.bets', this.bets);
        })  
        .catch(error => { console.log(error) });  
    },
  },
  beforeMount () { 
    console.log('1) beforeMount');
    console.log('2) default user role:', this.$store.state.loginUser.role);
    this.getAllData(); 
  }
}
</script>
