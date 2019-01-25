// const gameUsers = Vue.component('gameusers', {
<template>
  <div><li v-for="(item, index) in users" :key="index">{{index+1}}) {{item.username}}</li>
  </div>
</template>

<script>
export default {
  name: 'gameUsers',
  props: { 
    poolid: {type: String}
   ,gameData: {type: Object }     
  },  
  data () {
    return {
      rowsPerPageItems: [4, 8, 12],
      pagination: {  rowsPerPage: 4 },
      users: [],
    }
  },
  methods: {
    getGameUsers: function (pid, gid) {
      console.log("11) getGameUsers", pid, gid);
      this.result = 'Getting data from server...';
      var postdata = { op: "getGameUsers", data: {pid: pid, gid: gid} };    // name, date
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
        }).then(response => { 
            this.users = (response.body === null || response.body === "") 
                            ? [] : response.body.data;  
                              console.log("13) this.users",this.users);
        },      response => { this.result = 'Failed to load data to server.';
      });
    },
  },
  beforeMount(){ 
    this.getGameUsers(this.poolid, this.gameData.id); }
};
</script>
