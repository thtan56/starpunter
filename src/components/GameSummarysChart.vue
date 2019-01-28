// Vue.component('gamesummaryschart', { 
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
import moment from 'moment';

export default {
  name: 'gamesummaryschart',
  props: { username: {type: String } },
  components: { 'echart': ECharts },
  data() {
    return {
      games: [],
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
        yAxis:  [ { scale: true,
                   type: 'value',
                    axisLabel: { formatter: '{value}' }, 
                    name: 'Counts', nameLocation: 'middle', nameGap: 20 }],
        dataZoom: [
            { type: 'inside', start: 50, end: 100 },
            { show: true, type: 'slider', y: '90%', start: 50, end: 100 }
        ],                    
        grid: { right: '17%' },
        series: [ 
          { name: 'pools',    type: 'bar', data: [ ] },
          { name: 'tickets',  type: 'bar', data: [ ] }
        ]
      },       
    }
  },     
  methods: {
    plotGamesStat(games) {
      // prepare data for plotting
     alasql.fn.moment = moment; // Set moment() function available to AlaSQL
     alasql.fn.numeral = numeral;
      //var data = [{d:new Date()},{d:"2013-02-14"}];
      //var res = alasql('SELECT moment(d)->[add](1, "days")->calendar() as [When?]\
      //      FROM ?',[data]);
      var gamelist   = alasql('SELECT organiser, numeral(weekno).format("00") as weekno '
              + ', gamecount FROM ? group by organiser, weekno, gamecount',[games]);
      console.log("50) gamelist",gamelist);
      //--1) get dimensions (organiser, weekno) -----------------------
      var array = alasql('SELECT weekno FROM ? group by weekno order by weekno',[gamelist]);
      var wklist=[]; for(var i=0; i < array.length; i++) { wklist.push(array[i].weekno); };
      array = alasql('SELECT organiser FROM ? group by organiser',[gamelist]);
      var orglist=[]; for(var i=0; i < array.length; i++) { orglist.push(array[i].organiser); };
      //-- 2) initialise pdata with '-' --------------------------------------
      var orgdata=[];
      var rows   =orglist.length;
      var columns=wklist.length;     
      for (var i = 0; i < rows; i++) {
        orgdata.push(['-']);
        for (var j = 0; j < columns; j++) { orgdata[i][j] = '-'; }
      };
      //---3) populate pdata --------------------------------
      var wkindex=0;      var orgindex=0;
      //array = alasql('SELECT organiser, week, count(*) as ticketcount FROM ? group by organiser, week ',[gamelist] ); 
      for(var i=0; i < gamelist.length; i++) {
        wkindex   =  wklist.indexOf(gamelist[i].weekno);
        orgindex  = orglist.indexOf(gamelist[i].organiser);
        orgdata[orgindex][wkindex] = gamelist[i].gamecount;
      };      
      console.log("51) orgdata", orgdata, rows);
      //==4) legends ==============================
      this.bar.legend.data=orglist;
      //-- 5) series --------------------------------------------------
      for(var i=0; i < rows; i++) {   // for each week
        this.bar.series.push({ name: orglist[i], type: 'bar', data: orgdata[i],  stack: 'week' }); 
      };
      this.bar.xAxis=[];
      this.bar.xAxis.push({ type: 'category', data: wklist });
    },         
    getOrgWeekGames() {
      var result = 'Getting data from server...'; 
      var postdata = { op: "getGameSummary" };
      this.$http.post('/php/apiGame.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, pool_id, username, game_id
          this.games = (response.body === null) ? [] : response.body.data;    
          console.log("10)getGameSummary", this.games);                         
          this.plotGamesStat(this.games);
        },   response => { result = 'Failed to load data to server.';
      });
    },
  },    // end of methods
  created() {  
    console.log("1) created:stackchart");
    this.getOrgWeekGames();  }
};
</script>
