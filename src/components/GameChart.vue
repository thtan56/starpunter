// Vue.component('gamechart', {
<template>
    <echart :options="bar"></echart>   
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/bar'

export default {
  name: 'gamechart',
  props: { game_id: {type: String } },
  components: { 'echart': ECharts },
  data () {
    return {
      games:[],
      bar: {
        legend: {
          orient: 'horizontal', x: 'right', y: 'top',
          backgroundColor: '#eee', borderColor: 'rgba(178,34,34,0.8)',  borderWidth: 4,
          padding: 10,  itemGap: 20, textStyle: {color: 'red'},   selected: {'降水量' : false },
        },        
        title: { text: 'Game Statistics' },
        tooltip: { trigger: 'axis', axisPointer: {type: 'shadow'} },
        calculable : true,
        xAxis:  [ { type: 'category',  data: ['NBA Week 7', 'NBA Week8']  }],
        yAxis:  [ { type: 'value', name: 'Counts', nameLocation: 'middle', nameGap: 40 }],
        grid: { right: '17%' },
        series: [ 
          { name: 'Game',  type: 'bar', data: [ ] },
          { name: 'Pool',  type: 'bar', data: [ ] }
        ]
      },
    }
  },
  methods: {
    plotGameStat(games) {
      // prepare data for plotting
      var ticketlist = alasql('SELECT orgweek, game_id, count(*) as ticketcount FROM ? '
                +' group by orgweek, game_id ',[games]);
      var poollist = alasql('SELECT orgweek, pool_id, count(*) as poolcount FROM ? '
                +' group by orgweek, pool_id ',[games]);
      var owlist = alasql('SELECT orgweek, count(*) as orgweekcount FROM ? '
                +' group by orgweek ',[games]);
      console.log("120) getAllData", ticketlist, poollist, owlist);
      var row={};
      var tdata={};
      for(var i=0; i < ticketlist.length; i++) {
        row=ticketlist[i];
        tdata[row.orgweek]=row.ticketcount;
      };
      var pdata={};
      for(var i=0; i < poollist.length; i++) {
        row=poollist[i];
        pdata[row.orgweek]=row.poolcount;
      };
      var ow="";
      for(var i=0; i < owlist.length; i++) {
        ow=owlist[i].orgweek;
        owlist[i].ticketcount=(typeof tdata[ow] != 'undefined') ? tdata[ow] : '-';
        owlist[i].poolcount  =(typeof pdata[ow] != 'undefined') ? pdata[ow] : '-';
      };
      //================================
      var xdata=[];
      var y1data=[];
      var y2data=[]; 
      for(var i=0; i < owlist.length; i++) {
        xdata.push(owlist[i].orgweek);
        y1data.push(owlist[i].ticketcount);
        y2data.push(owlist[i].poolcount);
      };
      this.bar.xAxis=[]; 
      this.bar.series=[];  
      this.bar.title.text ='Game# Statistics';

      this.bar.xAxis.push({ type: 'category',           data: xdata });
      this.bar.series.push({ name: "game", type: 'bar', data: y1data, yAxisIndex: 0 });
      this.bar.series.push({ name: "pool", type: 'bar', data: y2data, yAxisIndex: 0 });   
    },  
    getAllData() {
      console.log("10) getAllData:game_id:", this.game_id);
      var result = 'Getting data from server...';
      var postdata = { op: "getTicketGamesByGame", gid: this.game_id };    // orgweek, username   
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, game_id, username, game_id
          if (response.body === null) { this.games = [];      
          } else { this.games = response.body.data;
                   console.log("11)this.games", this.games);
                   this.plotGameStat(this.games);     
          };  
        },   response => { this.result = 'Failed to load data to server.';
      });
    },    
  },   // end of methods
  created() {
    console.log("110) created-game_id", this.game_id);
    this.getAllData();
  }    
};
</script>
