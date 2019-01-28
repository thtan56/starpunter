// const homeCalendar = Vue.component('homecalendar', {
<template>
  <v-content>
    <homebars></homebars>
    <topboxes />
    <div>
    <fullCalendar class="test-fc" :events="fcEvents" 
      first-day='1' locale="en"
      @changeMonth="changeMonth"
      @eventClick="eventClick"
      @dayClick="dayClick"
      @moreClick="moreClick">

      <template slot="fc-event-card" slot-scope="p"><p>Title: {{ p.event.title }}</p></template>
      <template slot="fc-header-left"><h2>Sport Events</h2></template>
      <template slot="more-content" slot-scope="p">
        <div :style="{left: p.position.left + 'px', top: p.position.top + 'px'}" class="more-events">
          <div class="more-body">
            <ul class="body-list">
              <li v-for="(event, eventKey) in p.selectDay.events" v-show="event.isShow"
                :key="eventKey" class="body-item" @click="eventClick(event, $event)">
                {{ event.title }}
              </li>
            </ul>
          </div>
        </div>
      </template>
    </fullCalendar>
    </div>
      <!-- ===================================================================== -->
    <v-dialog v-model="editdialog" max-width="1000px">
      <v-card dark color="blue-grey">
        <v-card-title><span class="headline">{{formTitle}}</span></v-card-title>
        <v-card-text>
          <v-container grid-list-md>  
            <v-layout wrap>
              <v-flex xs4>   <!-- date1 picker -->
                <v-menu ref="menu" lazy :close-on-content-click="false" v-model="menu" transition="scale-transition" 
                            offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="editedItem.start">
                  <v-text-field slot="activator" label="start date" v-model="editedItem.start" prepend-icon="event" readonly></v-text-field>
                  <v-date-picker v-model="editedItem.start" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.menu.save(editedItem.start)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-flex>  

              <v-flex xs4>   <!-- date2 picker -->
                <v-menu ref="menu2" lazy :close-on-content-click="false" v-model="menu2" transition="scale-transition" 
                            offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="editedItem.end">
                  <v-text-field slot="activator" label="end date" v-model="editedItem.end" prepend-icon="event" readonly></v-text-field>
                  <v-date-picker v-model="editedItem.end" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="menu2 = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.menu2.save(editedItem.end)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-flex> 
              <v-flex xs4><v-text-field label="Id" v-model="editedItem.id" readonly background-color="red"></v-text-field></v-flex>

      <v-flex xs6><v-text-field label="Title" v-model="editedItem.title"></v-text-field></v-flex>
      <v-flex xs6><v-text-field label="Title" v-model="editedItem.remarks"></v-text-field></v-flex>

      <v-flex xs2><v-select label="Organiser" :items="organisers" @change="changeOrganiser" v-model="editedItem.organiser" ></v-select></v-flex>
      <v-flex xs3><v-combobox v-model="editedItem.home_team" :items="teams" label="Home Team:"></v-combobox></v-flex>
      <v-flex xs2><img :src="home2_logo" height="87px" width="100px" /></v-flex>         
      <v-flex xs3><v-combobox v-model="editedItem.away_team" :items="teams" label="Away Team:"></v-combobox></v-flex>
      <v-flex xs2><img :src="away2_logo" height="87px" width="100px" /></v-flex -->

              <v-flex xs4><v-text-field label="cssClass" v-model="editedItem.cssClass"></v-text-field></v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="white" flat @click.native="close">Cancel</v-btn><v-btn color="white" flat @click.native="save">Save</v-btn>
          <v-spacer></v-spacer>
          Status: {{ result }}
          <span class="badge badge-danger">{{error}}</span>
        </v-card-actions>
      </v-card>
    </v-dialog>  

  </v-content>        
</template>

<script>
import homebars from './HomeBars.vue';
import topboxes from './TopBoxes.vue';
import fullCalendar from 'vue-fullcalendar';
import moment from 'moment';

export default {
  name: 'homeCalendar',
  components: { homebars, topboxes, fullCalendar },   // 2
  data() {   
    return {
      editdialog: false,
      editedIndex: -1,
      editedItem: {start: '', end: '', title: '', cssClass: '', id: 0, 
            home_team: '', away_team: '', organiser:'', remarks: '' },
      menu: false,
      menu2: false,
      organisers: ['NBA', 'NBL', 'NFL', 'AFL'],
      teams: [],  
      error:'',
      result:'',
      event: {title:'', start:'', end:'', cssClass: [], 
              data: { description: '' } },
      fcEvents: [],
      displayTitle: '',
      home2_logo: '',
      away2_logo: '',
      currentDate: '',
    }
  },
  computed: {
      formTitle () { return this.editedItem.id === 0 ? 'New Event' : 'Edit Event' },
      getToday: {
        get: function () {
          let $today = new Date;
          return moment($today).format('YYYY/MM/DD');
        }
      }
  },
  methods: {
    changeOrganiser(selectObj) {
      console.log('90) changeOrganiser:', selectObj);
      this.editedItem.organiser = selectObj;
      this.getTeams(selectObj);
    },
    getTeams(organiser) {
      console.log('80) getTeams for:', organiser);
      this.result = 'Getting data from server...';
      var postdata = { op: "getOrgTeamNames", id: organiser };
      this.$http.post('php/apiTeam.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.teams = response.body.data;
          console.log('81) this.teams', this.teams);
        },      response => { this.result = 'Failed to load data to server.';
      });
    },
    changeMonth(start, end, current) {
      console.log('70) changeMonth', start, end, current);
      this.currentDate=current;
      this.getAllData();
    },
    dayClick(day, jsEvent) {   // new
      console.log('60) dayClick', day, jsEvent);
//      alert("click a day"+day);
      this.editedItem.start=moment(day).format('YYYY-MM-DD');
      this.editedItem.end=moment(day).format('YYYY-MM-DD');
      this.editedItem.title='';
      this.editedItem.cssClass="";
      this.editedItem.id = 0;
      this.editedIndex = -1;
      this.editdialog = true;
    },
    eventClick(day, jsEvent, pos) {    // edit
      this.editdialog = false;
      this.editedItem = day;
      // convert calendar shortnames to longnames for editing
      let mystr=this.editedItem.title;      let myarr=mystr.split(",");
      this.editedItem.organiser=myarr[0];
      if (this.editedItem.organiser === undefined || this.editedItem.organiser.length == 0) {
        this.editdialog = true;
      } else {
        this.result = 'Getting data from server...';
        var postdata = { op: "getTeamLongNames", keys: myarr };
        this.$http.post('php/apiTeam.php', JSON.stringify(postdata), {
            headers: { 'Content-Type': 'application/json' }
          }).then(response => { 
            let mystrs = response.body.data;
            let namearr=mystrs['name'].split(":"); 
              this.editedItem.home_team=namearr[0]; 
              this.editedItem.away_team=namearr[1];
            let logoarr=mystrs['logo'].split(":"); 
              this.home2_logo = 'images/'+logoarr[0];
              this.away2_logo = 'images/'+logoarr[1];
            this.editdialog = true;
          },      response => { this.result = 'Failed to load data to server.';
        });
      };

    },
    moreClick(day, events, jsEvent) {
      console.log('40) moreClick', day, events, jsEvent);
    },
    save: function () {
      this.error = '';
      this.result = 'Saving data to server...';
      var postdata = { "op": "save", "data": this.editedItem };
      console.log("30)save:this.editedItem", this.editedItem);
      this.$http.post('php/apiEvent.php', postdata,{ headers: { 'Content-Type': 'application/json' } })
        .then(response => { 
              this.getAllData();
              this.editdialog = false;          
        }, response => { this.result = 'Failed to save data to server.'; }
        );
    },
    close() {
      this.getAllData();     // refresh
      this.editdialog = false;
    },
    editItem: function(item){ this.event = item; },
    deleteItem: function(item){
      var r = confirm("Are you sure to delete this item?");
      if(r==true) {
        this.result = 'Deleting data to server...';
        var postdata = { op: "delete", id: item.id };
        this.$http.post('php/apiEvent.php', JSON.stringify(postdata),{ headers: { 'Content-Type': 'application/json' } })
          .then(response => { this.result = response.body;
          }, response => { this.result = 'Failed to delete data.'; }
          );
      }
    },
    getAllData: function () {
      console.log("10) getAllData:currentDate:",this.currentDate);
      this.result = 'Getting data to server...';
      var postdata = { op: "getEvents", date: this.currentDate };
      this.$http.post('php/apiEvent.php', JSON.stringify(postdata), { headers: { 'Content-Type': 'application/json' }})
        .then(response => { this.fcEvents = response.body.data;
          console.log("10) getAllData: this.fcEvents",this.fcEvents);
        }, response => { this.result = 'Failed to load data to server.'; }
        );
      }
    },
    beforeMount(){  
      this.username = this.$store.state.loginUser.username;
      this.currentDate=this.getToday;
      console.log("1) homeinfo.js-b4mount-user:", this.username);
      console.log("5) this.currentDate:", this.currentDate);
//      this.getAllData();  call by changeMonth
    }
};
</script>
