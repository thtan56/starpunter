const Pool = Vue.component('poolcomponent', {
  template: `
     <v-layout column>
        <v-toolbar color="pink" dark><v-toolbar-title>Pool Management</v-toolbar-title></v-toolbar>
        <v-container fluid grid-list-md>
          <v-form v-model="valid" ref="form">
            <v-layout row wrap>
              <v-flex xs3><v-text-field label="Scheme" v-model="editedItem.scheme"></v-text-field></v-flex>
              <v-flex xs9>
                 <v-radio-group v-model="editedItem.pool_type" row label="Pool type">
                   <v-radio v-for="item in bettypes" :key="item" :label="item" :value="item"></v-radio>
                 </v-radio-group>
               </v-flex>      

              <v-flex xs3><v-text-field label="Entry Cost" v-model="editedItem.entry_cost"></v-text-field></v-flex>
              <v-flex xs3><v-text-field label="Entry Quorum" v-model="editedItem.entry_quorum"></v-text-field></v-flex>
              <v-flex xs3><v-text-field label="Pool Prize" v-model="editedItem.pool_prize"></v-text-field></v-flex>
              <v-flex xs3><v-text-field label="Payout" v-model="editedItem.payout"></v-text-field></v-flex>

              <v-flex xs4>   <!-- odd date picker -->
                <v-menu ref="menu" lazy :close-on-content-click="false" v-model="menu" transition="scale-transition" 
                            offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="editedItem.odd_date">
                  <v-text-field slot="activator" label="Odd date" v-model="editedItem.odd_date" prepend-icon="event" readonly></v-text-field>
                  <v-date-picker v-model="editedItem.odd_date" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.menu.save(editedItem.odd_date)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-flex>

              <v-flex xs4><v-text-field label="Home Odd" v-model="editedItem.home_odd"></v-text-field></v-flex>
              <v-flex xs4><v-text-field label="Away Odd" v-model="editedItem.away_odd"></v-text-field></v-flex>

              <v-flex xs10><v-text-field label="Remarks" v-model="editedItem.remarks"></v-text-field></v-flex>
               <v-flex xs2><v-text-field label="id" v-model="editedItem.id"></v-text-field></v-flex>  

            </v-layout>
            <v-btn @click="save">save</v-btn>
            Status: {{ result }}
            <span class="badge badge-danger">{{error}}</span>
          </v-form>
        </v-container>
        <v-container fluid grid-list-md>
          <v-flex xs12>
            <v-card dark color="primary">
              <div>
              <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>     
              <v-data-table :headers="headers" :items="pools" :pagination.sync="pagination" :search="search">
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.scheme}}</td>
                  <td>{{ props.item.pool_type}}</td>
                  <td>{{ props.item.entry_cost}}</td>

                  <td>{{ props.item.entry_quorum}}</td>
                  <td>{{ props.item.pool_prize}}</td>
                  <td>{{ props.item.payout}}</td>
                  <td>{{ props.item.odd_date}}</td>
                  <td>{{ props.item.home_odd}}</td>
                  <td>{{ props.item.away_odd}}</td>

                  <td>{{ props.item.remarks}}</td>
                  <td>{{ props.item.id}}</td>
                  <td>
                    <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                    <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                  </td>
                </template>
   <template slot="footer">
      <td colspan="100%">
        <strong>Notes: Just fill the blanks to register a new pool</strong>
      </td>
    </template>
              </v-data-table>
              </div>            
            </v-card>
          </v-flex>
        </v-container>
      </v-layout>
`,
    data () {
      return {
        filterList: [
          { pool_type: 'odd' },
          { pool_type: 'head2head' },
          { pool_type: 'standard' },
          { pool_type: 'over' },
          { pool_type: 'under' }
        ],
        menu: false,
        search: '',
        result: '',
        error: '',
        valid: false,

        editedIndex: -1,
        editedItem: { id: 0, scheme: '', pool_type: '', entry_cost: 0, entry_quorum:0, pool_prize:0, payout:''
              ,odd_date:'', home_odd: 0, away_odd:0 , remarks: '' },


        pools: [],
        bettypes: ['odd', 'head2head', 'over', 'under', 'standard'],
        pagination: {},
        headers: [{ text: 'Scheme', value: 'scheme' }, { text: 'Pool Type', value: 'pool_type' } 
                  ,{ text: 'Entry Cost', value: 'entry_cost' },{ text: 'Entry Quorum', value: 'entry_quorum' }
                  ,{ text: 'Pool Prize', value: 'pool_prize' },{ text: 'Payout', value: 'payout' }
                  ,{ text: 'Odd Date', value: 'odd_date' },{ text: 'Home Odd', value: 'home_odd' }
                  ,{ text: 'Away Odd', value: 'away_odd' }
                  ,{ text: 'Remarks', value: 'remarks' },{ text: 'Id', value: 'id' }],
      }
    },
    methods: {
      save: function () {
        console.log("11) save:editedItem");
        console.log(this.editedItem);
        if(this.editedItem.scheme=='' ){
          this.error = 'Scheme fields are required';
          return;
        }
        if (this.editedItem.odd_date =='') {
          this.editedItem.odd_date = "2018-01-01";
          console.log("21) save: empty odd date");
        }
        this.error = '';
        this.result = 'Saving data to server...';
        var postdata = { "op": "save", "data": this.editedItem };
        this.$http.post('php/apiPool.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
          .then(response => {
            this.result = response.body;
            this.getAllData();                 // refresh datatable
            this.editedItem.id = 0;
            this.editedItem.scheme = '';
            this.editedItem.entry_cost = '';
            this.editedItem.entry_quorum = '';
            this.editedItem.entry_pool_prize = '';
            this.editedItem.entry_payout = '';
            this.editedItem.remarks = '';
          }, response => { this.result = 'Failed to save data to server.'; });
        },
        editItem: function(item){ this.editedItem = item; },
        deleteItem: function(item){
            var r = confirm("Are you sure to delete this item ("+item.scheme+ ")?");
            if(r==true) {
                this.result = 'Deleting data to server...';
                var postdata = { op: "delete", id: item.id };
                this.$http.post('php/apiPool.php', JSON.stringify(postdata),{
                    headers: { 'Content-Type': 'application/json' }
                }).then(response => { this.result = response.body;
                                      this.getAllData();    // refresh datatable
                },      response => { this.result = 'Failed to delete data.';
                });
            }
        },
        getAllData: function () {
          console.log('1) pools.js: getAllData');
            this.result = 'Getting data from server...';
            var postdata = { op: "getPools" };
            this.$http.post('php/apiPool.php', JSON.stringify(postdata), {
                headers: { 'Content-Type': 'application/json' }
            }).then(response => { this.pools = response.body.data;
              console.log(this.pools);
            },      response => { this.result = 'Failed to load data to server.';
            });
        }
    },
    beforeMount(){ this.getAllData(); }
});
