// Vue.component('userscashchart', { 
<template>
  <div>
    <v-card>
      <v-card-title>Users Cash Chart</v-card-title>
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
  name: 'UsersCashChart',
  components: { 'echart': ECharts },
  data () {
    return {
      users: [],
      initOptions: { renderer: "canvas" },
      bar: {
        legend: {
          orient: 'horizontal', x: 'right', y: 'top',
          backgroundColor: '#eee', borderColor: 'rgba(178,34,34,0.8)',  borderWidth: 4,
          padding: 10,  itemGap: 20, textStyle: {color: 'red'},   selected: {'降水量' : false },
        },        
        tooltip: { trigger: 'axis', axisPointer: {type: 'shadow'} },
        calculable : true,
        xAxis:  [ { type: 'category', boundaryGap: true, data: ['Username']  }],
        yAxis:  [ { type: 'value', name: 'Counts', nameLocation: 'middle', nameGap: 40 }],
        grid: { right: '17%' },
        series: [ 
          { name: 'cash',  type: 'bar', data: [ ] }
        ]
      },       
    }
  },  
  methods: {
    plotUsersCash(users) {
      this.bar.xAxis=[]; 
      this.bar.series=[]; 
      var xdata=[];
      var cashs=[];
      var vcashs=[];
      for(var u=0; u < users.length; u++) {
        xdata.push(users[u].username);        
        cashs.push(users[u].cash);  
        vcashs.push(users[u].vcash); 
      };
      this.bar.xAxis.push({ type: 'category', boundaryGap: true, data: xdata }); 
      this.bar.series.push({ name: 'cash',  type: 'bar', data: cashs, yAxisIndex: 0 });     
      this.bar.series.push({ name: 'vcash', type: 'bar', data: vcashs, yAxisIndex: 0 });  
    },              
    getAllData() {
      var result = 'Getting data from server...'; 
      var postdata = { op: 'getUsers' }; 
      this.$http.post('/php/apiUser.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                           
          console.log("10) reponse.body", response.body);
          this.users = (response.body === null) ? [] : response.body.data;                             
          this.plotUsersCash(this.users);
        },   response => { result = 'Failed to load data to server.';
      });
    },
  },    // end of methods
  created() {  
    console.log('Echart2 Widget - Component Loaded!');
    this.getAllData();  
  }
};
</script>
