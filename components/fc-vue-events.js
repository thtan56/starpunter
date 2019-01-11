const gamecalendar = Vue.component('gameCalendar', {
  //   props: { 'organiser': {type: String } },
  template: ` 
    <div id="cal">{{check}}</div>
  `,
  data() {
    return {
      organiser: 'NBA',
      check: 'test',
      cal: null,
      header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay'
      },
    }
  },
  mounted() {
    var args = {
        lang: 'en',
        header: {
          left:   'prev,next today',
          center: 'title',
          right:  'month,agendaWeek,agendaDay'
        },
        height: "auto",
        allDaySlot: false,
        slotEventOverlap: false,
        timeFormat: 'HH:mm',
        dayClick (date, event, view) {
          console.log(date, event, view)
          console.log(date.format())
        }        
    }
    this.cal.fullCalendar(args)
  },
  created() { 
    console.log('1) created:'+this.organiser);
  },
  methods: { }
})

var app = new Vue({
  el: '#app',
  data: { 
    message: 'Hello Vue!',
    genre: [], 
    time: [] 
  },
  created () {
    console.log('1) fc-vue-events.js: created');
//    let qry = 'database/json_users_email.php?email=' + this.$store.state.loginUser.email;   //this.$route.params.userId;
//    console.log(qry);   
//    axios.get(qry)
//      .then(response => { 
//        this.user = response.data[0];
//        console.log(this.user);
//      })  
//      .catch(error => { console.log(error) });  
  },
  methods: {},
  components: { gamecalendar } 
});
  