// Vue.component('pooltable', { 
<template>
  <div>
    <v-toolbar slot="header" class="mb-2" color="indigo darken-5" dark>
      <v-toolbar-title>Pools</v-toolbar-title>
      <v-btn flat> <v-icon small @click="changeRound(-7)">fast_rewind</v-icon>
          {{ round }}<v-icon small @click="changeRound(7)">fast_forward</v-icon>
      </v-btn>
      <span STYLE="font-size: 10pt">({{pstart | moment }}:{{pend | moment }})</span>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-card-title>                                                                <!-- 2 -->
          <v-layout row wrap>
            Organiser:
            <div v-for="org in organisers" :key="org">
              <input type="radio" :value="org" id="org" v-model="organiser" @click="check($event)"> {{org}}
            </div>
          </v-layout>
        </v-card-title>         
      </v-toolbar-items>
    </v-toolbar>
    <v-data-table :pagination.sync="pagination" :headers="headers" :items="pools">                        
      <template slot="items" slot-scope="props">
        <!-- tr @click="child3Selected(props.item)" -->
          <td>{{ props.item.id}} / {{ props.item.pool_name}}</td>  
          <td>{{ props.item.pool_type}}</td>
          <td>{{ props.item.entry_cost}}</td>
          <td>{{ props.item.entry_quorum}} / {{ props.item.entrants}}</td>
          <td>{{ props.item.pool_prize}} / {{ props.item.payout}}</td>
          <td>{{ props.item.total_collection}}/{{ props.item.total_collection}}</td>
          <td>{{ props.item.status}}</td>         
          <td>{{ props.item.status}}</td>  
          <td><v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
              <v-icon small @click="deleteItem(props.item)">delete</v-icon>
          </td>
      </template>           
    </v-data-table>
    <!-- ===================================================================== -->
    <v-dialog v-model="editdialog" max-width="1000px">
      <v-card dark color="blue-grey">
        <v-card-title><span class="headline">{{formTitle}} {{editedItem.id}}</span></v-card-title>
        <v-card-text>
          <v-layout row wrap>              
            <v-flex xs4><v-text-field label="Organiser" v-model="editedItem.organiser"></v-text-field></v-flex>
            <v-flex xs4><v-text-field label="Round" v-model="editedItem.round"></v-text-field></v-flex>

            <v-flex xs4><v-text-field label="Pool Name" v-model="editedItem.pool_name"></v-text-field></v-flex>
            <v-flex xs4><v-text-field label="Pool#"    v-model="editedItem.id" readonly></v-text-field></v-flex>  

            <v-flex xs3><v-text-field label="Pool Type"  v-model="editedItem.pool_type"></v-text-field></v-flex>
            <v-flex xs3><v-text-field label="Entry Cost" v-model="editedItem.entry_cost"></v-text-field></v-flex>
            <v-flex xs3><v-text-field label="Entry Quorum"   v-model="editedItem.entry_quorum"></v-text-field></v-flex>   
            <v-flex xs3><v-text-field label="Entrants" v-model="editedItem.entrants"></v-text-field></v-flex>  
            <v-flex xs3><v-text-field label="Pool Prize"   v-model="editedItem.pool_prize"></v-text-field></v-flex>
            <v-flex xs3><v-text-field label="Payout" v-model="editedItem.payout"></v-text-field></v-flex>  
            <v-flex xs3><v-select v-model="editedItem.status" :items="statuses" label="Status:"></v-select></v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-btn color="white" flat @click.native="close">Cancel</v-btn>
          <v-btn color="white" flat @click.native="save">Save</v-btn>
          <v-spacer></v-spacer>
          Status: {{ result }}
          <span class="badge badge-danger">{{error}}</span>
        </v-card-actions>
      </v-card>
    </v-dialog>             
  </div>
</template>

<script>
export default {
  name: 'pooltable',
  data() {
    return { 
      pools: [],
      organiser: 'NBA',
      organisers: ['NBA', 'NBL', 'NFL', 'AFL'],
      round: '',
      pstart: '',
      pend: '',
      today: '',
      editdialog: false, 
      rowsPerPageItems: [4, 8, 12],
      pagination: {  rowsPerPage: 5 }, 
      headers: [ { text: 'Pool# / Name', value: 'id' }      
          ,{ text: 'Pool Type', value: 'pool_type' } 
          ,{ text: 'Entry Cost', value: 'entry_cost' }
          ,{ text: 'Quorum/Entrants', value: 'entry_quorum' }                 
          ,{ text: 'Pool Prize/Payout', value: 'pool_prize' }                 
          ,{ text: 'Total Collection / Payout', value: 'total_collection' } 
          ,{ text: 'Status', value: 'status' }
               ],
      editedIndex: -1,
      editedItem: { 
              organiser: '',round:'', id: ''  ,pool_name: ''  ,pool_type:'' ,entry_cost: '' ,entry_quorum:''
              ,entrants: 0 ,pool_prize:'',payout:'', status: '', total_collection: 0, total_payout: 0
              },
        statuses: ['pending', 'closed'],            
      error: '',
      result: ''                             
    }
  },    
  computed: { 
    pageTitle() { return 'Leadership Result for the week ' + moment().format('W') },  
    formTitle () { return this.editedIndex === -1 ? 'New User' : 'Edit User' },
  },  
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },  
  methods: {
    check: function(e) {
      if (e.target.checked) {
        this.organiser = e.target.value;    // 1) select organiser
        this.getAllData();                    // 2) get rounds & default round
      }
    },  
    //child3Selected(item) {  
    //  console.log("35) child3Selected", item);
    //  this.$router.push({name:'sysuser', params: {username: item.username} });           
      // this.$emit('clicked-child2selected', item);
    //},       
    close () { this.editdialog = false;  },    
    closeDialog () {
      console.log('51) closeDialog');
      this.editdialog = false;  
    },
    save: function () {
      this.error = '';
      this.result = 'Saving data to server...';
      var postdata = { "op": "save", "data": this.editedItem };
      this.$http.post('/php/apiPool.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
        .then(response => {
          this.result = response.body;
          this.close(); 
          this.getAllData();                 // refresh datatable      
        }, response => { this.result = 'Failed to save data to server.'; }
        );
    },
    editItem: function(item){ 
      this.editedItem = item;
      this.editdialog=true; 
    },
    deleteItem: function(item){
      var r = confirm("Are you sure to delete this item?"+item.id);
      if(r==true) {
        this.result = 'Deleting data to server...';
        var postdata = { op: "delete", id: item.id };
        this.$http.post('/php/apiUser.php', JSON.stringify(postdata),{ headers: { 'Content-Type': 'application/json' } })
          .then(response => { 
            this.result = response.body;
            this.getAllData();
          }, response => { this.result = 'Failed to delete data.'; }
          );
      }
    },
    changeRound(days) {    // prev, next buttons
      let objDate = moment(this.today, 'YYYY/MM/DD').toDate();   // this.today = string
      this.today = moment(objDate).add(days, 'days').format('YYYY/MM/DD');  // moment needs obj
      this.getRound();
    },
    getRound() {
      console.log("11) getRound",this.organiser, this.today);
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getOrgCurrentRound", data: {organiser: this.organiser, today: this.today} };    
      this.$http.post('/php/apiPeriod.php', JSON.stringify(postdata), 
            { headers: { 'Content-Type': 'application/json' }
      }).then(response => { 
          if (response.body.data.length === 0) {
                this.round = "";
                this.pstart = "";
                this.pend ="";
                this.games = [];
          } else {
                this.round = response.body.data[0].round;
                this.pstart = response.body.data[0].start;
                this.pend = response.body.data[0].end_dt;
                this.getAllData();  // asyn problem
          };
        },  response => { this.result = 'Failed to load data to server.';
      });
    },
    getAllData: function () {
      console.log("10) getAllData", this.organiser, this.today);
      this.result = 'Getting data to server...';
      var postdata = { op: "getOrgDatePools", data: { organiser: this.organiser, today: this.today } };
      this.$http.post('/php/apiPool.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }})
        .then(response => {
          if (response.body === null) { this.pools=[];  
          } else {              
            this.pools = response.body.data;
          };
          console.log("2) getAllData > this.pools", this.pools);
        },   response => { this.result = 'Failed to load data to server.';
      });
    },
  },
  created() {
    this.organiser="NBA";
    this.today = moment().format('YYYY/MM/DD');
    this.getRound();
  }
};
</script>
 