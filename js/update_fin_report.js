//const ClientTable = VueTables.ClientTable;       // vue-table-2
//const Event = Vuetable.Event;    // import eventbus

Vue.use(Vuetable);       // vue-table-2

Vue.component('echart', VueECharts);  // register to use
Vue.component('v-select',VueSelect.VueSelect);

Vue.component('my-detail-row', {
  template: `
    <div @click="onClick">
      <div class="inline field"><label>Name: </label><span>{{rowData.name}}</span></div>
      <div class="inline field"><label>Email: </label><span>{{rowData.email}}</span></div>
      <div class="inline field"><label>Nickname: </label><span>{{rowData.nickname}}</span></div>
      <div class="inline field"><label>Birthdate: </label><span>{{rowData.birthdate}}</span></div>
      <div class="inline field"><label>Gender: </label><span>{{rowData.gender}}</span></div>
    </div>
    `,
  props: {
    rowData: {type: Object, required: true},
    rowIndex: {type: Number}
  },
  methods: {
    onClick (event) {console.log('my-detail-row: on-click', event.target)}
  }
});

new Vue({
  el: '#app',
  components:{
    'vuetable':Vuetable.Vuetable,
    'vuetable-pagination-info': Vuetable.VuetablePaginationInfo,
    'vuetable-pagination': Vuetable.VuetablePagination
  },
  data() { 
    return {
      currquery:"",        // F(avorite), S(ector);
      currfavorite: "",    // 1,2,3,9
      currsector:"",        // fin, consumber, etc
      currticker:"",

      tickers: [],
      sectors: [],

      toggle_update:"",
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
//      cellbg: {'bg-danger', 'bg-info', 'bg-warning', 'bg-success'},
  
      fields: [ 
          { name: '__sequence', title: '#',titleClass: 'center aligned',dataClass: 'right aligned'},
          { name: '__handle', dataClass: 'center aligned'},
          { name: '__checkbox', titleClass: 'center aligned', dataClass: 'center aligned'},
          { name: 'name', sortField: 'name' },
          { name: 'email', sortField: 'email' }, 
          { name: 'birthdate', callback: 'formatDate|DD-MM-YYYY',titleClass: 'center aligned',dataClass:'center aligned' } ,
          { name: 'nickname', callback: 'allcap' },
          { name: 'gender', callback: 'genderLabel',titleClass: 'center aligned',dataClass:  'center aligned' } ,
          { name: 'salary', callback: 'formatNumber',titleClass: 'center aligned', dataClass:  'right aligned', visible: false } ],
      fields2: ['ticker', 'qtr', 'sector', 'favorite','eps','dividend', 'price', { name:'pm', title: 'Profit Margin' } ],             
      fields3: [ {name: 'ticker', title: 'Ticker'}, {name: 'sector', title: 'Sector'}, 
                {name:'favorite', title: 'Favorite'}, 'close','sharpe',
                {name: 'mdd', title: 'Max DrawDown', callback: 'mddStatus'}, 
                {name:'retavg', title: 'Average Returns'},
                {name: 'sd', title: 'Std Dev'}], 
      
      dt2finances: [],                
      dt3sharpes: [],              // prices = stock's latest price

      dataCount2: 0,        // appear in html 
      dataCount3: 0, 

      searchFor: "",  
      filterText: '',
      moreParams: {},
      css: {
        table: {
          tableClass: 'table table-striped table-bordered table-hovered',
          loadingClass: 'loading',
          ascendingIcon: 'glyphicon glyphicon-chevron-up',
          descendingIcon: 'glyphicon glyphicon-chevron-down',
          handleIcon: 'glyphicon glyphicon-menu-hamburger',  },
        pagination: {
          infoClass: 'pull-left',
          wrapperClass: 'vuetable-pagination pull-right',
          activeClass: 'btn-primary',
          disabledClass: 'disabled',
          pageClass: 'btn btn-border',
          linkClass: 'btn btn-border',
          icons: { first: '', prev: '', next: '', last: '' },}
      },
      pagination: {
          total: 200,
          per_page: 15,
          current_page: 1,
          last_page: 14,
          next_page_url: "",
          prev_page_url: null,
          from: 1,
          to: 15,
        },

      e6chart: {
        title: {},
        tooltip: { trigger: 'axis' },
        legend: { type: "scroll", orient: "vertical", right: 10, top:20, bottom: 20,
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
  //----------------------------
  watch: {
    dt2finances (newVal, oldVal) { this.$refs.vuetable2.refresh()},       // ***   2)
    dt3sharpes (newVal, oldVal) { this.$refs.vuetable3.refresh()}       // ***   2)
  },
  created() {
    console.log("1) created()");
    this.currquery = "F";     // favorite
    this.currfavorite = 1;
    this.currsector = "";  
    this.currticker ="SUNCON";
    this.toggle_update = 'no';    
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

    axios.get('json_group_tickers.php?type=F&groupid=1')    // get tickers for favorite 1 (tickers)
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
//--------------------------------
  },
  mounted: function () {
    console.log("2) mounted");      // get data for dt3sharpes table
    this.$refs.vuetable2.setData(this.dt2finances);   // *** 4) dt2finances
    this.$refs.vuetable3.setData(this.dt3sharpes);   // *** 4) sharpes
  },
//====================================================================  
  methods: {
      onCellClicked (data, field, event) {
        console.log('cellClicked:', field.name);
        this.$refs.vuetable.toggleDetailRow(data.id)
      },
      doFilter () {
        console.log('doFilter:', this.filterText);
        this.searchFor = this.filterText;
        this.$nextTick( () => this.$refs.vuetable2.refresh() )      // invoke dataManager 
      },
      resetFilter () {
        this.filterText = ''
        console.log('resetFilter')
      },

    setFilter (param, filterText) {
      console.log('setFilter:'+param+'='+filterText);
      this.moreParams[param] = filterText;

      for (var key in this.moreParams) {
        console.log("Key "+key + " has value "+ this.moreParams[key]);     // split into key=>value
      } 

      this.searchFor=filterText;       
      Vue.nextTick( () => this.$refs.vuetable2.refresh())            // refresh financial table
    },
    transform(data) {
//      console.log('TRANSFORM!');
//      console.log(data);
      return data
    },
    onPaginationData (paginationData) {
      this.$refs.paginationTop.setPaginationData(paginationData)      
      this.$refs.paginationInfoTop.setPaginationData(paginationData)  

      this.$refs.pagination.setPaginationData(paginationData);
      this.$refs.paginationInfo.setPaginationData(paginationData)  },
    onPaginationData2(paginationData) { 
      this.$refs.pagination2.setPaginationData(paginationData); 
      this.$refs.paginationInfo2.setPaginationData(paginationData) },    
    onPaginationData3(paginationData) { 
      this.$refs.pagination3.setPaginationData(paginationData); 
      this.$refs.paginationInfo3.setPaginationData(paginationData) },  
    onChangePage(page)  { this.$refs.vuetable.changePage(page)},
    onChangePage2(page) { this.$refs.vuetable2.changePage(page); },   
    onChangePage3(page) { this.$refs.vuetable3.changePage(page); },  
    onLoading()         { },   // b4 mounting

    dataManager2(sortOrder, pagination) {               
      console.log("2c) dataManager2 (4c): ");
      let data = this.dt2finances;                    // localData2
      if (this.searchFor) {                          // search function (can be generic if search not needed)
        let txt = new RegExp(this.searchFor, "i");
        data = _.filter(data, function(item) {      // pass data record
          return (item.ticker.search(txt) >= 0 ||
            item.sector.search(txt) >= 0 ||          // or sector          
            item.favorite.search(txt) >= 0          // search fovrite
          );   // search ticker
        });
      };
      if (sortOrder.length > 0) {
        console.log("orderBy:", sortOrder[0].sortField, sortOrder[0].direction);
        data = _.orderBy(data, sortOrder[0].sortField, sortOrder[0].direction);
      };
      pagination = this.$refs.vuetable2.makePagination(data.length); // 2) vuetable2
      return {
        pagination: pagination,                                      
        data: _.slice(data, pagination.from - 1, pagination.to)
      };
    },      // dataManager
    dataManager3(sortOrder, pagination) {               
      console.log("2d) dataManager3 (4c): ");
      let data = this.dt3sharpes;                          
      if (this.searchFor) {                         
        let txt = new RegExp(this.searchFor, "i");
        data = _.filter(data, function(item) {      
          let sfavorite = item.favorite.toString();  // cannot work with number
          return (
            item.sector.search(txt) >= 0 ||                  
            sfavorite.search(txt) >= 0          
          );
        });
      };
      if (sortOrder.length > 0) {
        data = _.orderBy(data, sortOrder[0].sortField, sortOrder[0].direction);
      };
      pagination = this.$refs.vuetable2.makePagination(data.length); // 2) vuetable2
      return {
        pagination: pagination,                                      
        data: _.slice(data, pagination.from - 1, pagination.to)
      };
    },      // dataManager
//**********************************************
    allcap(value) {
      return value.toUpperCase()
    },
    mddStatus(value) {
      return (value < -0.10) 
      ? '<p class="bg-danger">'+value+'</p>'
      : '<p class="bg-success">'+value+'</p>'
    },
    genderLabel(value) {
      return value == 'M'
      ? '<span class="label label-info"><i class="glyphicon glyphicon-star"></i> Male</span>'
      : '<span class="label label-success"><i class="glyphicon glyphicon-heart"></i> Female</span>'
    },
    formatNumber(value) { return accounting.formatNumber(value,2) },
    formatDate(value, fmt = 'D MMM YYYY') { return (value == null) ? '' : moment(value, 'YYYY-MM-DD').format(fmt) },

    changeFavorite(val) {
      console.log("3) changeFavorite:"+val);
      if (this.toggle_update ==='yes') {
        console.log('update=yes');
      } else {
        console.log('update=no')
      };
      if(val) {    
        this.currquery = "F";        
        this.currfavorite = val.value;      // not null    
        this.searchFor = val.value;
        this.drawGroupCharts("F", val.value);
      }
    },
    changeSector(val) {
      console.log("4) changeSector");
      if(val) {            // not null    
        console.log("4b) changeSector:"+val.value);
        this.currquery = "S"; 
        this.currsector = val.value;

        if (this.toggle_update ==='no') {
          this.searchFor = val.value;
          this.drawGroupCharts("S", val.value);      // draw if not updating
        } else {
          console.log("4a) Updating fintable for "+val.value+ " Please wait for notification in console.");
          let qry = 'php/html_update_fav_report.php?type='+this.currquery+'&groupid='+this.currsector;
          axios.get(qry)   
          .then( response => {
            let messages=response.data;
            console.log("4b) update ok");
            console.log(messages);
          })
          .catch(error => { console.log(error); });
        }
      }
    },    
    changeTicker(val) {
      console.log("3c) changeTicker:"+val);
      console.log(val);
      if(val) {          // not null 
        console.log('selected:'+val.value);        
        this.currticker=val.value;
        this.searchFor = val.value;
        this.drawe5Combo(this.dt2finances);            // using financial & currticker info as inputs
        this.setFilter('ticker', val.value);     // *** search value 
      }
    },
    drawGroupCharts(queryid, value) {
      console.log("11) drawGroupCharts:"+queryid + ">" + value);
       // part 7 - dt3sharpes datatable
      let qry = 'json_stocks_sharpe.php?type='+queryid+'&groupid='+value;     // same as json_stocks_group.php
      axios.get(qry)
      .then( response => {
        this.dt3sharpes=response.data;
      })
      .catch(error => { console.log(error); });   
      // part 6 - eps    
      qry = 'json_stocks_fin.php?type='+queryid+'&groupid='+value
      axios.get(qry)
      .then( response => {
        this.dt2finances=response.data;                   // 3) quarterly report for selected favorite or sector
        this.drawe6Bar(this.dt2finances);
        this.drawe5Combo(this.dt2finances);
       })
      .catch(error => { console.log(error); });
//
      this.vs3options=[];                   // 5a) empty old options
      axios.get('json_group_tickers.php?type='+queryid+'&groupid='+value) 
      .then( response => {
        this.tickers = response.data;       // 5b) & get new ticker list
        for (var i=0; i < this.tickers.length; i++) {
          this.vs3options.push({
            label: this.tickers[i].ticker,
            value: this.tickers[i].ticker
          });
        };
      })
      .catch(error => { console.log(error); });
    },
    drawe6Bar(data) {
      console.log("30) drawe6Bar");
      console.log(data);
      let grouptitle = (this.currquery == 'F' ? 'Favorite:'+this.currfavorite : 'Sector:'+this.currsector);      
      this.e6chart.title.text= grouptitle;
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
    drawe5Combo(data) {
      let txt = new RegExp(this.currticker, "i");
      data = _.filter(data, function(item) {      // pass data record
        return (
          item.ticker.search(txt) >= 0          // search ticker
        );
      });
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
    }, // end of drawe5Combo
  },   // end of methods
  events: {
        'vuetable:loading': function() {
            // display your loading notification
            console.log ("load started");
        },
        'vuetable:load-success': function(response) {
            // hide loading notification
            console.log ("load completed");
        },
        'vuetable:initialized]': function(data) {
          console.log("vuetable initialising");
          console.log(data);
        },
  },  
}); 
//=========================================
            