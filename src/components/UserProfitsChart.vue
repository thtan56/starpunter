// Vue.component('userprofitschart', { 
<template>
  <div>
    <v-card>
      <v-card-title>{{username}} Profits Chart</v-card-title>
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
  name: 'userprofitschart',
  props: { username: {type: String } },
  components: { 'echart': ECharts },
  data () {
    return {
      tickets: [],
   //=========================
      initOptions: { renderer: "canvas" },
      bar: {
        legend: {
          orient: 'horizontal', x: 'right', y: 'top',
          backgroundColor: '#eee', borderColor: 'rgba(178,34,34,0.8)',  borderWidth: 4,
          padding: 10,  itemGap: 20, textStyle: {color: 'red'},   selected: {'降水量' : false },
        },        
        tooltip: { trigger: 'axis', axisPointer: {type: 'shadow'} },
        calculable : true,
        xAxis:  [ { type: 'category', boundaryGap: true, data: ['NBA Week 7', 'NBA Week8']  }],
        yAxis:  [ { type: 'value', name: 'Counts', nameLocation: 'middle', nameGap: 40 }],
        grid: { right: '17%' },
        series: [ 
          { name: 'profit',  type: 'bar', data: [ ] }
        ]
      },       
    }
  },   
  watch: {
    username (newVal, oldVal)  { 
      console.log("30) change username", this.username);
      this.getUserTickets(); }
  },  
  methods: {
    plotUserProfits(tickets) {
      console.log("110) plotUserProfit:tickets", tickets);
      var owlist = alasql('SELECT orgweek, count(*) as orgweekcount FROM ? '
                 +' group by orgweek ',[tickets]);
      var profitlist = alasql('SELECT orgweek '
                  + ', sum(income::NUMBER) as totalincome, sum(entry_cost::NUMBER) as totalcost FROM ? '
                   +' group by orgweek ',[tickets]);    
      console.log("120) plotUsersStat:owlist:profitlist", owlist, profitlist);
      var prdata=[];
      var csdata=[];
      var ow='';
      for(var w=0; w < profitlist.length; w++) {   // for each user
          ow=profitlist[w].orgweek;
          prdata[ow]=profitlist[w].totalincome;
          csdata[ow]=profitlist[w].totalcost;
      };
      var profits=[];
      var costs=[];
      for(var k=0; k < owlist.length; k++) {
        ow=owlist[k].orgweek;
        profits[k]=(typeof prdata[ow] != 'undefined') ? prdata[ow] : '-';
        costs[k]  =(typeof csdata[ow] != 'undefined') ? csdata[ow] : '-';
      };
      console.log("125) profits", profits);
      //================================
      this.bar.xAxis=[]; 
      this.bar.series=[]; 
      var xdata=[];
      for(var w=0; w < owlist.length; w++) {
        xdata.push(owlist[w].orgweek);        
      };
      this.bar.xAxis.push({ type: 'category', boundaryGap: true, data: xdata }); 
      this.bar.series.push({ name: 'profit', type: 'bar', data: profits, yAxisIndex: 0 });     
      this.bar.series.push({ name: 'cost',   type: 'bar', data: costs, yAxisIndex: 0 });  
    },              
    getUserTickets() {
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getUserTickets", username: this.username }; 
      this.$http.post('/php/apiTicket.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                             // orgweek, pool_id, username, game_id, betscore
          console.log("11) getUserTickets", response.body);
          this.tickets = (response.body === null) ? [] : response.body.data;                             
          console.log("12) getUserTickets:this.tickets",this.username,this.tickets);
          if (typeof this.tickets !== "undefined")  {  
            this.plotUserProfits(this.tickets);
          } else { 
            console.log("12) clear chart");
            this.bar.series=[];
            this.bar.series.push({ name: 'profit', type: 'bar', data: [], yAxisIndex: 0 });  
            this.bar.series.push({ name: 'cost', type: 'bar', data: [], yAxisIndex: 0 }); 
          };  
        },   response => { var result = 'Failed to load data to server.';
      });
    },
  },    // end of methods
  created() {  
    console.log("1) created", this.username);
    this.getUserTickets();  }
};
</script>
