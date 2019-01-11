Vue.component('userscashchart', { 
  template: `
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
  `,
 data() {
    return {
      users: [],
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
      postdata = { op: "getUsers" }; 
      this.$http.post('/php/apiUser.php', JSON.stringify(postdata), { 
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {                           
          this.users = (response.body === null) ? [] : response.body.data;                             
          this.plotUsersCash(this.users);
        },   response => { result = 'Failed to load data to server.';
      });
    },
  },    // end of methods
  created() {  this.getAllData();  }
});

Vue.component('usersscorechart', { 
  template: `
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
  `,
 data() {
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
      postdata = { op: "getOrgWeek" };    // all
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
});
Vue.component('userprofitschart', { 
  props: { username: {type: String } },
  template: `
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
  `,
 data() {
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
      postdata = { op: "getUserTickets", username: this.username }; 
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
});

Vue.component('gamechart', {
  props: {
    game_id: {type: String }      // username, etc
  },
  template: /* syntax: html */ `
    <echart :options="bar"></echart>   
  `,
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
});
Vue.component('summarychart', { 
  template: `
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
  `,
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
      postdata = { op: "getOrgWeek" };    // all
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

});
Vue.component('summarystackchart', { 
  template: `
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
  `,
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
      postdata = { op: "getOrgWeek" };    // all
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
});
Vue.component('gamesummaryschart', { 
  template: `
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
  `,
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
      postdata = { op: "getGameSummary" };
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
});
