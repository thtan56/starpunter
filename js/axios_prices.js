Vue.use(VueTables.ClientTable);       // vue-table-2
Vue.component('echart', VueECharts);  // register to use
Vue.component('v-select',VueSelect.VueSelect);
new Vue({
  el: '#app',
  data() { 
    return {
      currquery:"",        // F(avorite), S(ector);
      currfavorite: "",    // 1,2,3,9
      currsector:"",        // fin, consumber, etc
      currticker:"", 
      currbelow: "",
      tickers: [],
      sectors: [],
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

      stkcolumns: [ 'ticker', 'price', 'eps', 'pe' ],    // 1) vue-table-2 parameters
      dt1options: { perPage: 10,  },
      prices : [],          // stocks' latest price   same as sharpes[]

      shrpcolumns : ['ticker', 'sector', 'close','pe', 'sharpe','mdd','retavg','sd'],
      dt2options: { perPage: 15,
        headings: { ticker: 'Ticker', sector: 'Sector', close: 'Price', pe: 'PE Ratio', 
                    sharpe: 'Sharpe Ratio', mdd: 'Max DrawDown', retavg: 'Avg Returns', sd: 'Std Dev' }
      },      
      sharpes : [],          // stocks' sharpe info : favorite 1

      fincolumns : [ 'ticker', 'qtr','eps','dividend','price','pm'],
      dt3options: { perPage: 10 },     
      financials : [],   

      chartOptions : {
        title: {text: "CanvasJS Chart in Vue.js"},
        data: [ { type: "bar", dataPoints: [] }]
      },
      chart1: null,

      echart2: {
        tooltip: {trigger: 'item', formatter: "{a} <br/>{b} : {c} ({d}%)"},
        legend: {orient: 'vertical',left: 'left',data: []},
        series: [ { name: '访问来源', type: 'pie', radius: '55%', center: ['50%', '60%'], data: [],
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
      e4chart: {
        tooltip: { trigger: 'axis' },
        legend: { data: ['PPB', 'SUNCON', 'PESTECH'] },
        xAxis: [{ type: 'time' }],
        yAxis: [{ type: 'value' }],
        series: [
          {name:"PPB", type: "line", data: [['2018-01-01', 4], ['2018-01-02', 3], ['2018-01-10', 2]]},
          {name:"SUNCON", type: "line", data: [['2018-01-04', 4], ['2018-01-06', 3], ['2018-02-10', 2]],},
          {name:"PESTECH", type: "line", data: [['2018-01-02', 4], ['2018-01-05', 3], ['2018-02-01', 2]]}
        ],
      },            // e4chart  
      e6chart: {
        tooltip: { trigger: 'axis' },
        legend: { orient: "vertical", x: 'right', y: 'top', padding: 0,
          data: ['PPB', 'SUNCON', 'PESTECH'] },
        xAxis: [{ type: 'category' }],
        yAxis: [{ type: 'value' }],
        series: [],
      },            // e4chart  
      e5combo: {
        title: { text: 'SunCon' },
        tooltip: { trigger: 'axis', axisPointer: {type: 'shadow'} },
        calculable : true,
        legend: { data:['Price','EPS','Dividend'] },
        xAxis: [ { type: 'category', data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'] }],
        yAxis: [ {type: 'value',name: '水量', axisLabel: { formatter: '{value} a'}}, {type: 'value',name: '温度', axisLabel: { formatter: '{value} b'}}],
        series: [
          {name:'蒸发量', type:'bar',data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]},
          {name:'降水量', type:'bar',data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]},
          {name:'平均温度',type:'line', data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2], yAxisIndex: 1} ]
      },
  //------------------------------------      
    }         // return
  },          // data
  created() {
    console.log("1) created()");
    this.currquery = "F";     // favorite
    this.currfavorite = 1;
    this.currsector = "";  
    this.currticker = "SUNCON";
    this.currbelow = "10";   
    axios.get('json_sectors_data.php')      // get sector list
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
   this.drawGroupCharts("F", 1);    // favourite 1
  },
  mounted: function () {
    console.log("2) mounted");      // get data for sharpes table
  },
  methods: {  
    changeFavorite(val) {
      console.log("3a) changeFavorite:"+val);
      if(val) {    
        this.currquery = "F";        
        this.currfavorite = val.value;      // not null    
        this.drawGroupCharts("F", val.value, 2);
      }
    },
    changeSector(val) {
      console.log("3b) changeSector:"+val);
      if(val) {          // not null    
        this.currquery = "S"; 
        this.currsector = val.value;    
        this.drawGroupCharts("S", val.value);
      }
    },    
    changeTicker(val) {
      if(val) {          // not null    
        this.currticker=val.value;
        this.drawe5Combo(); 
      }
    },
    changePrice(val) {              // not used yet
      console.log("3d) changePrice:"+val);
      console.log(val);
      if(val) {          // not null 
        console.log('selected:'+val);   
        this.currbelow = val;
        let groupvalue = (this.currquery == 'F' ? this.currfavorite : this.currsector);
        let qry = 'json_daily_group.php?type='+this.currquery+'&groupid='+groupvalue+'&price_range='+val;   
        axios.get(qry)
        .then( response => {
          this.dailys = response.data;
          this.drawe4Line(this.dailys);                
        })
        .catch(error => { console.log(error); });
        }
    },
    drawGroupCharts(queryid, value) {
      console.log("11) drawGroupCharts:"+queryid + ">" + value);
      // part 1                                 F/S
      let qry = 'json_stocks_sharpe.php?type='+queryid+'&groupid='+value;
      axios.get(qry)
      .then( response => {
        this.sharpes=response.data;
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
        this.drawe4Line(this.dailys);                // e4chart
      })
      .catch(error => { console.log(error); });
      // part 6 - eps    
      qry = 'json_stocks_fin.php?type='+queryid+'&groupid='+value
      axios.get(qry)
      .then( response => {
        this.financials=response.data;                   // 3) quarterly report for selected favorite or sector
        this.drawe6Bar(response.data);
        this.drawe5Combo();                 // filter out a ticker from this.financial using currticker
       })
      .catch(error => { console.log(error); });
      //------------------------------------------------  
      this.vs3options=[];               // 5) empty old options & get new tickers list      
      axios.get('json_group_tickers.php?type='+queryid+'&groupid='+value) 
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
    //------------------------------------  
    },

    drawcBar(data) {
      for (var i=0; i < data.length; i++) {
        this.chartOptions.data[0].dataPoints.push({
          label: data[i].ticker,
          y: data[i].price
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
        this.echart2.legend.data.push(data[i].ticker);
        this.echart2.series[0].data.push({ value: data[i].price, name:  data[i].ticker });
      };
    },
    draweBar(data) {
      this.echart3.series[0].type='bar';
      this.echart3.series[0].data=[];    // clear old data
      this.echart3.yAxis[0].data=[];       
      this.echart3.legend.data=[];       // not render needed, just replace data  

      for (var i=0; i < data.length; i++) {
        this.echart3.legend.data.push(data[i].ticker);
        this.echart3.series[0].data.push(data[i].price);
        this.echart3.yAxis[0].data.push(data[i].ticker);
      };
    },
    drawe4Line(data) {
      console.log("20) drawe4Line");
      this.e4chart.legend.data=[];
      this.e4chart.series=[];
      let sdata=[];       // current series value
      let prevticker = data[0].ticker;
      for (var i=0; i < data.length; i++) {
        if (prevticker !== data[i].ticker) {
          this.e4chart.legend.data.push(prevticker);
          this.e4chart.series.push({ name: prevticker, type: 'line', data: sdata, yAxisIndex: 0 });
          prevticker = data[i].ticker;
          sdata=[];
        };
        sdata.push([data[i].date, data[i].price]);
      };
      this.e4chart.legend.data.push(prevticker);
      this.e4chart.series.push({ name: prevticker, type: 'line', data: sdata, yAxisIndex: 0 });
      this.e4chart.yAxis = [{type: 'value',name: 'price'}, {type: 'value',name: 'eps'} ];
    },
    drawe6Bar(data) {
      console.log("30) drawe6Bar");
      console.log(data);
      this.e6chart.legend.data=[];
      this.e6chart.series=[];
      let sdata=[];       // current series value
      let prevticker = data[0].ticker;
      for (var i=0; i < data.length; i++) {
        if (prevticker !== data[i].ticker) {
          this.e6chart.legend.data.push(prevticker);
          this.e6chart.series.push({ name: prevticker, type: 'bar', data: sdata, yAxisIndex: 0 });
          prevticker = data[i].ticker;
          sdata=[];
        };
        sdata.push([data[i].qtr, data[i].eps]);
      };
      this.e6chart.legend.data.push(prevticker);
      this.e6chart.series.push({ name: prevticker, type: 'bar', data: sdata, yAxisIndex: 0 });
      this.e6chart.yAxis = [{type: 'value',name: 'eps'}];
      this.e6chart.xAxis = [{type: 'category',
                data: ['2018q1','2018q2','2018q3','2018q4','2019q1']}];
    },
    drawe5Combo() {
      let data=this.financials;
      console.log("9) drawe5combo");
      console.log(data);      
      this.e5combo.xAxis[0].data=[];
      let prices=[]; let eps=[];  let divs=[]; let pms=[];
      for (var i=0; i < data.length; i++) {
        if (data[i].ticker==this.currticker) { 
          prices.push(data[i].price);
          eps.push(data[i].eps);
          divs.push(data[i].dividend);
          pms.push(data[i].pm);        
          this.e5combo.xAxis[0].data.push(data[i].qtr);
        } 
      };  
      this.e5combo.series=[
              { name: 'price',   type: 'line',data: prices, yAxisIndex: 0 },
              { name: 'eps',     type: 'bar', data: eps,    yAxisIndex: 1, barGap: 0 },
              { name: 'pmargin', type: 'bar', data: pms,    yAxisIndex: 1 },              
              { name: 'dividend',type: 'bar', data: divs,   yAxisIndex: 1 }];
      this.e5combo.yAxis       = [{type: 'value',name: 'price'}, {type: 'value',name: 'eps'} ];   
      this.e5combo.legend.data = ['price', 'eps', 'pmargin', 'dividend'];
      this.e5combo.title.text=this.currticker;   // must defined 1st at the top
    },
//------------------------------------    
  }   // return - data
}); 
//=========================================