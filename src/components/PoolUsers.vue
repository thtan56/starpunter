// const poolUsers = Vue.component('poolusers', {
<template>
  <div><li v-for="(item, index) in users" :key="index">{{index+1}}) {{item.username}}</li>
  </div>
</template>
<script>
export default {
  name: 'poolUsers',
  props: { pool: {type: Object } },
  data () {
    return {
      rowsPerPageItems: [4, 8, 12],
      pagination: {  rowsPerPage: 4 },
      users: [],
    }
  },
  methods: {
    getPoolUsers: function () {
      console.log("1) getPoolUsers");
      this.result = 'Getting data from server...';
      var postdata = { op: "getPoolUsers", pool: this.pool };    // name, date
      this.$http.post('/php/apiBet.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.users = response.body.data;
                              console.log("10) this.users");
        },      response => { this.result = 'Failed to load data to server.';
      });
    },
  },
  beforeMount(){ this.getPoolUsers(); }
};
</script>      
