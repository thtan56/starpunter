// Vue.component('usersscorechart', { 
<template>
  <div>
    <v-card>
      <v-card-title>Users Weekly Score</v-card-title>
      <v-responsive>
        <figure>        <!-- must include, css in mycss.css -->
          <echart flex :options='line' :init-options="initOptions" ref='bar'
                auto-resize />
        </figure>
      </v-responsive>
    </v-card>
  </div> 
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'

export default {
  name: 'UsersCashChart',
  components: { 'echart': ECharts },
  data () {
    return {
      tgames: [],
   //=========================
      initOptions: { renderer: "canvas" },
      line: {
        legend: {
          orient: 'horizontal', x: 'center', y: 'top',
          backgroundColor: '#eee', borderColor: 'rgba(178,34,34,0.8)',  borderWidth: 4,
          padding: 10,  itemGap: 20, textStyle: {color: 'red'},   selected: {'降水量' : false },
        },        
        tooltip: {
          mode: 'label',
          trigger: 'item', 
          axisPointer: { 
            type: 'cross',
            label: {show:true}},
            formatter: '{a}: {c}'
        },
        calculable : true,
        xAxis:  [ { type: 'category', boundaryGap: false, data: ['NBA Week 7', 'NBA Week8']  }],
        yAxis:  [ { type: 'value', axisLabel: { formatter:'{value}'} }],
        grid: { right: '17%' },
        series: [ 
          { name: 'Game',  type: 'line', data: [ ] },
          { name: 'Pool',  type: 'line', data: [ ] }
        ]
      },       
    }
  },     
  methods: {
    plotUsersScore(tgames) {
      console.log("110) plotUsersStat:games", tgames);
      var owlist = alasql('SELECT orgweek, count(*) as orgweekcount FROM ? '
                 +' group by orgweek ',[tgames]);
      var userlist = alasql('SELECT username, count(*) as orgweekcount FROM ? '
                   +' group by username ',[tgames]);    
      console.log("120) plotUsersStat:owlist:userlist", owlist, userlist);

      var sdata=[];
      var uname='';
      var ow='';
      var scorelist=[];
      var row={};
      var results=[];
      for(var u=0; u < userlist.length; u++) {   // for each user
        uname=userlist[u].username;
        scorelist  = alasql('SELECT username, orgweek, sum(betscore::NUMBER) as totalscore FROM ? ' 
                          +' WHERE username = ?'
                          +' GROUP BY username, orgweek'
                          +' ORDER BY username, orgweek', [tgames, uname]);  
        console.log("130) plotUsersStat", uname, scorelist);
        sdata=[];
        for(var j=0; j < scorelist.length; j++) {   // for selected user
          row=scorelist[j];
          sdata[row.orgweek]=row.totalscore;
        };
        var totals=[];
        for(var k=0; k < owlist.length; k++) {
          ow=owlist[k].orgweek;
          totals[k]=(typeof sdata[ow] != 'undefined') ? sdata[ow] : '-';
        };
        results[u]=totals;
      };
      console.log("150) results", results);
      //================================
      this.line.xAxis=[]; 
      this.line.series=[]; 
      var xdata=[];
      for(var w=0; w < owlist.length; w++) {
        xdata.push(owlist[w].orgweek);
        for(var u=0; u < results.length; u++) {
          this.line.series.push({ name: userlist[u].username, type: 'line', data: results[u], yAxisIndex: 0 });          
        }
      };
      this.line.xAxis.push({ type: 'category', boundaryGap: false, data: xdata }); 
      //this.line.title.text ='User# Statistics';
    },              
    getOrgWeekUsers() {
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getOrgWeek" };    // all
      this.$http.post('/php/apiTicketGames.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, pool_id, username, game_id, betscore
          this.tgames = (response.body === null) ? [] : response.body.data;                             
          this.plotUsersScore(this.tgames);  
        },   response => { var result = 'Failed to load data to server.';
      });
    },
  },    // end of methods
  created() {  
    console.log("1) created");
    this.getOrgWeekUsers();  }
};
</script>
