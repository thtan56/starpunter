Vue.use(VueTables.ClientTable);    // vue-table-2
Vue.component('echart', VueECharts);  // register to use
Vue.component('v-select',VueSelect.VueSelect);

Vue.component('my-dropdown', {
  template: `
    <div class="my-dropdown">  
      <label for="selectFavorite">Hide Favourite:</label>
      <div class="selected" @click="toggle">Selected value</div>
      <div class="options" v-show="isOpen">
        <div class="option" v-for="option in soptions" @click="set(option)">
          {{ option }}
        </div>
      </div>
  </div>
  `,
  data: function() {
    return {
      my_favorite: '1',
      isOpen: false,
      selected: 'Select your favorite',
      soptions: [ '1', '2', '3' ],
    }
  },
  methods: {
    toggle: function() { this.isOpen = !this.isOpen; },
    show: function() { this.isOpen = true; },
    hide: function() { this.isOpen = false; },
    set: function(option) {
      this.selected = option;
      this.hide();
    },
  },
  created: function() {
    console.log('b1) my-dropdown: created start');
    console.log(this.my_favorite);
  },
  mounted: function() {
    console.log('b2) my-dropdown: mounted start');

  }
}),

new Vue({
  el: '#app',
  data() { 
    return {
      currquery:"",        // F(avorite), S(ector);
      currfavorite: "",    // 1,2,3,9
      currsector:"",        // fin, consumber, etc
      currbelow: "",
      tickers: [],
      sectors: [],
      prices : [],          // stocks' latest price
      dailys : [],          // daily prices
      datatable: [],
      vs1options: [               // dropdown - favorite
        {label: '1', value: '1'},
        {label: '2', value: '2'},
        {label: '3', value: '3'}
      ],
      vs2options:[],              // dropdown - sectors
      vs3options:[],              // dropdown - favorite tickers
      vs4options: ["50", "10", "5", "2"],  // dropdowm - price range

      vs1selected: "",
      vs2selected: "",
      vs3selected: "",
      vs4selected: "",

      columns: [ 'label', 'y' ],    // 1) vue-table-2 parameters
      options: { perPage: 5,  },
      chartOptions : {
        title: {text: "CanvasJS Chart in Vue.js"},
        data: [ { type: "bar", dataPoints: [] }]
      },
      chart1: null,

      echart2: {
        tooltip: {trigger: 'item', formatter: "{a} <br/>{b} : {c} ({d}%)"},
        legend: {orient: 'vertical',left: 'left',data: []},
        series: [ {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [],
          itemStyle: {emphasis: {shadowBlur: 10,shadowOffsetX: 0,shadowColor: 'rgba(0, 0, 0, 0.5)' }}
        }],   // series
      },       // echart2  
      echart3: {
        title : { text: '某地区蒸发量和降水量', subtext: '纯属虚构' },
        tooltip: { trigger: 'axis' },
        legend: {data:['2012年']},
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        xAxis : [ {type : 'value', boundaryGap : [0, 0.01] }],
        yAxis : [ {type : 'category', data : ['巴西','印尼','美国','印度','中国','世界人口(万)']}],
        series : [{name:'2012年', type:'bar', data:[19325, 23438, 31000, 121594, 134141, 681807]}]    // series
      },   // echart3
      e4line: {
//        title : { text : '时间坐标折线图',subtext : 'dataZoom支持'},
        tooltip : { trigger: 'axis' },
        toolbox: {
            show : true,
            orient: 'vertical',
            x: 'right',
            y: 'center',
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
//        dataZoom: {show: true, start : 70},
        legend : {data : ['series2']},
        grid: {y2: 80},
        xAxis : [],
        yAxis : [],
        series : []
      },            // e4line
      //=========== end of e4 line      
      lxAxis : [{ 
        type : 'category',
        boundaryGap: true, 
        axisTick: {onGap:false},
        splitLine: {show:false},
        data:[]
      }], 
      //===================================
      e5combo: {
        title: { text: 'SunCon' },
        tooltip: { trigger: 'axis',
                    axisPointer: {type: 'shadow'} },
        calculable : true,
        legend: { data:['Price','EPS','Dividend'] },
        xAxis: [ {
                type: 'category',
                data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        }],
        yAxis: [
          {type: 'value',name: '水量', axisLabel: { formatter: '{value} a' } },
          {type: 'value',name: '温度', axisLabel: { formatter: '{value} b' } }
        ],
        series: [
          {name:'蒸发量', type:'bar',data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]},
          {name:'降水量', type:'bar',data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]},
          {name:'平均温度',type:'line', data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
                  yAxisIndex: 1}
        ]
      },
  //------------------------------------      
    }         // return
  },          // data
  created() {
    console.log("1) created()");
    console.log("a)current favorite/sector/query:"+this.currfavorite+">"+this.currsector+">"+this.currquery);
    this.currquery = "F";     // favorite
    this.currfavorite = 1;
    this.currsector = "";  
    this.currbelow = "10";   
    console.log("b)current favorite/sector/query:"+this.currfavorite+">"+this.currsector+">"
                                                  +this.currquery+">"+this.currbelow);
//    this.setVs2Options();      // cannot work if call from methods ????  
    axios.get('json_sectors_data.php')
      .then( response => {
        this.sectors = response.data;
        for (var i=0; i < this.sectors.length; i++) {
          this.vs2options.push({
            label: this.sectors[i].sector,
            value: this.sectors[i].sector
          });
        };
      })
      .catch(error => { console.log(error); });

    axios.get('json_fav_tickers.php?favorite=1')
      .then( response => {
        this.tickers = response.data;
        for (var i=0; i < this.tickers.length; i++) {
          this.vs3options.push({
            label: this.tickers[i].ticker,
            value: this.tickers[i].ticker
          });
        };
      })
      .catch(error => { console.log(error); });
    this.drawGroupCharts("F", 1);    // favourite 1
  },
  mounted: function () {
    console.log("2) mounted");
    console.log("a)current favorite/sector/query:"+this.currfavorite+">"+this.currsector+">"+this.currquery);
    this.chartOptions.data[0].type = "column";
  },
  methods: {  
    changeFavorite(val) {
      console.log("a9) changeFavorite:"+val);
      if(val) {    
        this.currquery = "F";        
        this.currfavorite = val.value;      // not null    
        this.drawGroupCharts("F", val.value, 2);
      }
    },
    changeSector(val) {
      console.log("a10) changeSector:"+val);
      if(val) {          // not null    
        this.currquery = "S"; 
        this.currsector = val.value;      
        this.drawGroupCharts("S", val.value);
      }
    },    
    changeTicker(val) {
      console.log("a10) changeTicker:"+val);
      console.log(val);
      if(val) {          // not null 
        console.log('selected:'+val.value);   
        let qry = 'json_stocks_fin.php?ticker='+escape(val.value);   // F&N
        axios.get(qry)
          .then( response => {
            console.log('99)change ticker');
            console.log(response.data);
            this.draweCombo(response.data); 
          })
          .catch(error => { console.log(error); });   
      }
    },
    changePrice(val) {
      console.log("a10) changePrice:"+val);
      console.log(val);
      if(val) {          // not null 
        console.log('selected:'+val);   
        this.currbelow = val;
        let groupvalue = (this.currquery == 'F' ? this.currfavorite : this.currsector);
        let qry = 'json_daily_group.php?type='+this.currquery+'&groupid='+groupvalue+'&price_range='+val;   
        axios.get(qry)
        .then( response => {
          this.dailys = response.data;
          this.draweLine(this.dailys);                
        })
        .catch(error => { console.log(error); });
        }
    },
    
    drawTickerChart(tid) {
      let qry = 'json_stocks_fin.php?ticker='+tid;
      axios.get(qry)
      .then( response => {
        this.draweCombo(response.data); 
      })
      .catch(error => { console.log(error); }); 
    },
    drawGroupCharts(queryid, value) {
      // part 1                                 F/S                
      let qry = 'json_stocks_group.php?type='+queryid+'&groupid='+value;
      axios.get(qry)
      .then( response => {
        this.prices = response.data;
        this.drawcBar(this.prices);      // canvasjs chart
        this.drawePie(this.prices);      // vue-echart  
        this.draweBar(this.prices); 
      })
      .catch(error => { console.log(error); });
      // part 2
      qry = 'json_daily_group.php?type='+queryid+'&groupid='+value+'&price_range='+this.currbelow;   // below price < 10
      axios.get(qry)
      .then( response => {
        this.dailys = response.data;
        this.draweLine(this.dailys);                // e4line
      })
      .catch(error => { console.log(error); });
      // part 3
      qry = 'json_stocks_fin.php?ticker=SUNCON';
      axios.get(qry)
      .then( response => {
        this.fins = response.data;
        console.log("combo");
        console.log(this.fins);
        this.draweCombo(response.data); 
      })
      .catch(error => { console.log(error); });      
    },

    drawcBar(data) {
      for (var i=0; i < data.length; i++) {
        this.chartOptions.data[0].dataPoints.push({
          label: data[i].label,
          y: data[i].y
        });
      };
      this.chart1 = new CanvasJS.Chart("chartContainer1", this.chartOptions);
      this.chart1.render();
    },
    drawePie(data){ 
      this.echart2.series[0].type='pie';      
      this.echart2.series[0].data=[];    // clear old data
      this.echart2.legend.data=[];       // not render needed, just replace data
      for (var i=0; i < data.length; i++) {
        this.echart2.legend.data.push(data[i].label);
        this.echart2.series[0].data.push({ value: data[i].y, name:  data[i].label });
      };
    },
    draweBar(data) {
      this.echart3.series[0].type='bar';
      this.echart3.series[0].data=[];    // clear old data
      this.echart3.yAxis[0].data=[];       
      this.echart3.legend.data=[];       // not render needed, just replace data  

      for (var i=0; i < data.length; i++) {
        this.echart3.legend.data.push(data[i].label);
        this.echart3.series[0].data.push(data[i].y);
        this.echart3.yAxis[0].data.push(data[i].label);
      };
    },
    draweLine(data) {
      console.log("11) draweLine");
      console.log("a)current favorite/sector/query:"+this.currfavorite+">"+this.currsector+">"+this.currquery);
      this.e4line.legend.data=[];
      this.e4line.series=[];
      let prevticker = data[0].ticker;
      let sdata=[];       // current series value
      let s=0;            // current series index - for xAxis update only
      this.lxAxis[0].data=[];

      for (var i=0; i < data.length; i++) {
        if (prevticker !== data[i].ticker) {
          this.e4line.legend.data.push(prevticker);
          this.e4line.series.push({ name: prevticker, type: 'line', yAxisIndex: 0, data: sdata });
          prevticker = data[i].ticker;
          sdata=[];
          s++;
        };
        sdata.push(data[i].price);
        if (s==0) { this.lxAxis[0].data.push(data[i].date); }   // why this is ok ??????
      };
      this.e4line.legend.data.push(prevticker);
      this.e4line.series.push({ name: prevticker, type: 'line', yAxisIndex: 0, data: sdata });
      this.e4line.xAxis.push(this.lxAxis[0]);
      this.e4line.yAxis.push( { type : 'value', name: ''} );   // cannot move to component ??????
      this.e4line.yAxis.push( { type : 'value', name: ''} );   // cannot move to component ??????
      // last series
    },
    draweCombo(data) {
      this.e5combo.xAxis[0].data=[];
      let prices=[];
      let eps=[];
      let divs=[];
      let pms=[];
      for (var i=0; i < data.length; i++) {
        prices.push(data[i].price);
        eps.push(data[i].eps);
        divs.push(data[i].dividend);
        pms.push(data[i].pm);        
        this.e5combo.xAxis[0].data.push(data[i].qtr); 
      };  
      this.e5combo.series=[
              { name: 'price',   type: 'line',data: prices, yAxisIndex: 0 },
              { name: 'eps',     type: 'bar', data: eps,    yAxisIndex: 1, barGap: 0 },
              { name: 'pmargin', type: 'bar', data: pms,    yAxisIndex: 1 },              
              { name: 'dividend',type: 'bar', data: divs,   yAxisIndex: 1 }];
      this.e5combo.yAxis       = [{type: 'value',name: 'price'}, {type: 'value',name: 'eps'} ];   
      this.e5combo.legend.data = ['price', 'eps', 'pmargin', 'dividend'];
      this.e5combo.title.text=data[0].ticker;   // must defined 1st at the top
      console.log('end of combo');
      console.log(this.e5combo);
    },
//------------------------------------    
  }   // return - data
});  
//=========================================