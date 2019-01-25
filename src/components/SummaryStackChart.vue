// Vue.component('summarystackchart', { 
<template>
  <div>
    <v-card>
      <v-card-title><slot></slot></v-card-title>
      <v-responsive>
        <figure>        <!-- must include, css in mycss.css -->
          <echart flex :options='bar' :init-options="initOptions" ref='sbar'
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
  name: 'summarystackchart',
  props: { username: {type: String } },
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
        xAxis:  [ { type: 'category',  
                    data: ['NBA Week 7', 'NBA Week8'],
                    name: 'Week', 
                    nameLocation: 'middle', 
                    nameGap: 40 
          }],
        yAxis:  [ { type: 'value',
                    axisLabel: { formatter: '{value}' }, 
                    name: 'Counts', nameLocation: 'middle', nameGap: 20 }],
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
      var ticketlist   = alasql('SELECT week, pool_id, ticket_id FROM ? group by week, pool_id, ticket_id',[games]);
      //--1) get dimensions (pool id, week) -----------------------
      var array = alasql('SELECT week FROM ? group by week',[ticketlist]);
      var wklist=[]; for(var i=0; i < array.length; i++) { wklist.push(array[i].week); };
      //----------------------------
      array = alasql('SELECT pool_id FROM ? group by pool_id',[ticketlist]);
      var poollist=[]; for(var i=0; i < array.length; i++) { poollist.push(array[i].pool_id); };
      //-- 2) initialise pdata with '-' --------------------------------------
      var pdata=[];
      var rows=poollist.length;
      var columns=wklist.length;     
      for (var i = 0; i < rows; i++) {
        pdata.push(['-']);
        for (var j = 0; j < columns; j++) { pdata[i][j] = '-'; }
      };
      //---3) populate pdata --------------------------------
      var wkindex=0;      var pindex=0;
      array = alasql('SELECT pool_id, week, count(*) as ticketcount FROM ? group by pool_id, week ',[ticketlist] ); 
      for(var i=0; i < array.length; i++) {
        wkindex = wklist.indexOf(array[i].week);
        pindex  = poollist.indexOf(array[i].pool_id);
        pdata[pindex][wkindex] = array[i].ticketcount;
      };      
      //==4) legends ==============================
      var pids=[];
      for(var i=0; i < poollist.length; i++) { pids.push(poollist[i]); };
      this.bar.legend.data=pids;
      //-- 5) series --------------------------------------------------
      for(var i=0; i < rows; i++) {   // for each week
        this.bar.series.push({ name: pids[i], type: 'bar', data: pdata[i],  stack: 'week' }); 
      };
      this.bar.xAxis=[];
      this.bar.xAxis.push({ type: 'category', data: wklist });
    },         
    getOrgWeekPools() {
      var result = 'Getting data from server...'; 
      var postdata = { op: "getOrgWeek" };    // all
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, pool_id, username, game_id
          this.tgames = (response.body === null) ? [] : response.body.data;    
          console.log("10)getOrgWeekPools:tgames", this.tgames);                         
          this.plotPoolsStat(this.tgames);
        },   response => { result = 'Failed to load data to server.';
      });
    },
  },    // end of methods
  created() {  
    console.log("1) created:stackchart");
    this.getOrgWeekPools();  }
};
</script>
