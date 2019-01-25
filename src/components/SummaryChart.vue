// Vue.component('summarychart', { 
<template>
  <div>
    <v-card>
      <v-card-title><slot></slot></v-card-title>
      <v-responsive>
        <figure>        <!-- must include, css in mycss.css -->
          <echart flex :options='bar' :init-options="initOptions" ref='bar'
                auto-resize />
        </figure>
      </v-responsive>
    </v-card>
  </div> 
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/bar'

export default {
  name: 'summarychart',
  components: { 'echart': ECharts },
  data() {
    return {
      pools: [],
      initOptions: { renderer: "canvas" },
      //=========================
      bar: {
        grid: { top: '6', right: '0', bottom: '17', left: '25' },
        legend: {
          orient: 'horizontal', x: 'center', y: 'top',
          backgroundColor: '#eee', borderColor: 'rgba(178,34,34,0.8)',  borderWidth: 4,
          padding: 10,  itemGap: 20, textStyle: {color: 'red'},   selected: {'降水量' : false },
        },        
        tooltip: { trigger: 'axis', axisPointer: {type: 'shadow'} },
        calculable : true,
        xAxis:  [ { type: 'category',  data: ['NBA Week 7', 'NBA Week8']  }],
        yAxis:  [ { type: 'value', name: 'Counts', nameLocation: 'middle', nameGap: 30 }],
        grid: { right: '17%' },
        series: [ 
          { name: 'pools',    type: 'bar', data: [ ] },
          { name: 'tickets',  type: 'bar', data: [ ] }
        ]
      },       
    }
  },     
  methods: {
    plotPoolsStat(games) {
      // prepare data for plotting
      var poollist   = alasql('SELECT orgweek, pool_id   FROM ? group by orgweek, pool_id ',[games]);
      var ticketlist = alasql('SELECT orgweek, ticket_id FROM ? group by orgweek, ticket_id ',[games]);
      var gamelist   = alasql('SELECT orgweek, game_id   FROM ? group by orgweek, game_id ',[games]);    
      var owplist = alasql('SELECT orgweek, count(*) as poolcount   FROM ? group by orgweek',[poollist]);     
      var owtlist = alasql('SELECT orgweek, count(*) as ticketcount FROM ? group by orgweek',[ticketlist]); 
      var owglist = alasql('SELECT orgweek, count(*) as gamecount   FROM ? group by orgweek',[gamelist]); 
      console.log("120) getAllData", poollist, owplist);
      //================================
      var xdata=[];
      var ydata=[];
      var y2data=[];
      var y3data=[];   
      for(var i=0; i < owplist.length; i++) {
        xdata.push(owplist[i].orgweek);
        ydata.push(owplist[i].poolcount);
        y2data.push(owtlist[i].ticketcount);
        y3data.push(owglist[i].gamecount);
      };
      this.bar.xAxis=[]; 
      this.bar.series=[];  
      this.bar.xAxis.push({ type: 'category',           data: xdata });
      this.bar.series.push({ name: "pools",   type: 'bar', data: ydata,  yAxisIndex: 0 }); 
      this.bar.series.push({ name: "tickets", type: 'bar', data: y2data, yAxisIndex: 0 });       
      this.bar.series.push({ name: "games",   type: 'bar', data: y3data, yAxisIndex: 0 }); 
    },         
    getOrgWeekPools() {
      var result = 'Getting data from server...'; 
      var postdata = { op: "getOrgWeek" };    // all
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, pool_id, username, game_id
          this.tgames = (response.body === null) ? [] : response.body.data;                             
          this.plotPoolsStat(this.tgames);
        },   response => { result = 'Failed to load data to server.';
      });
    },
  },    // end of methods
  created() {  this.getOrgWeekPools();  }

};
</script>
