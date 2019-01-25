// Vue.component('poolusertable', { 
<template>
  <div>
    <v-toolbar flat color="primary">
      <v-toolbar-title>Users [{{selected.orgweek}} Pool#{{selected.pool_id}}]</v-toolbar-title>
    </v-toolbar>
    <v-data-table :pagination.sync="pagination" :headers="uheaders" :items="data">                        
      <template slot="items" slot-scope="props">
        <tr @click="childSelected(props.item)">    
          <td>{{ props.item.orgweek}}</td>  
          <td>{{ props.item.pool_id}}</td>  
          <td>{{ props.item.username}} : {{ props.item.gamecount}}</td>
        </tr>
      </template>  
      <template slot="footer">
        <td colspan=2><strong>click row for game info</strong></td>
      </template>          
    </v-data-table> 
  </div>
</template>

<script>
export default {
  name: 'poolusertable',
  props: { selected: {type: Object },
           data: {type: Array } },
  data() {
    return {  
      rowsPerPageItems: [4, 8, 12],
      pagination: {  rowsPerPage: 10 }, 
      uheaders: [ { text: 'Organiser/Round', value: 'orgweek' }
                ,{ text: 'Pool#', value: 'pool_id' }             
                ,{ text: 'Username/Game Count', value: 'username' }
                ],
      gamelist: []
    }
  },
  methods: {  
    childSelected(item) { 
      console.log("1) poolusertable-getSelected", item);
      this.$emit('clicked-child2selected', item);
    },
  }  
};
</script>
