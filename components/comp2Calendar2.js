Vue.filter('currency', function(val, dec) { return accounting.formatMoney(val, '$', dec)     });
Vue.filter('number', function(val, dec) { return accounting.formatNumber(val, dec, ',', '.') });

window['moment-range'].extendMoment(moment);
var today = new Date();
var events = [];
var calendars = ['example1', 'example2', 'example3'];  
var titles = ['Football Event', 'Playing Bingo', 'Studying', 'Meeting with John', 'Meeting with Isabel', 'Daily Scrum', 'Preparing presentation', 'Presenting Something Important', 'Travel time'];
var locations = ['New York', 'Amsterdam', 'Hilversum, Larenseweg 512', '2nd floor, Cap Office', 'Coffeeshop'];
var descriptions = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.', 'Sed ut perspiciatis unde omnis iste natus error', 'vel illum qui dolorem eum fugiat quo voluptas nulla pariatur', 'sed quia non numquam', 'Neque porro quisquam est', 'Ut enim ad minima veniam.'];

const range = moment.range(moment().subtract(14, 'days'), moment().add(14, 'days')); //today=16/9/18; range=2/9/18 : 30/9/18 ie 14 days before & 14 days after
// moment() = today date

const CalendarTest = Vue.component('calendarTest', {
  template: ` 
  <v-container fluid grid-list-lg class="mt-0">
    <responsive-calendar force-monday-first="true" max-size="1" :events="events" :initial-calendar-information="calendarInformation"></responsive-calendar>
  </v-container>
  `,
  data() { 
    return {
      events: [{
        dateStart: new Date(today.getTime() + (21.5 * 60 * 60 * 1000)),    // show tomorrow
        dateEnd:   new Date(today.getTime() + (22.5 * 60 * 60 * 1000)),      
        styleClass: 'optional css class',
        summary: 'Here a summary',
        description: 'The description',
        location: 'Location'
      }],
      calendarInformation: { 
          'example1': { name: 'example1', displayName: 'Example Calendar', color: '#de6e4b' } ,
          'example2': { name: 'example2', displayName: 'Another One',      color: '#7fd1b9' } ,
          'example3': { name: 'example3', displayName: 'Important One',    color: '#e56399' }
      },
    }
  },
  created() { 
    this.getAllData();
    console.log('created-this.events');
    console.log(this.events);
  },
  methods: {
    getAllData() {
      console.log("11) getAllData-day");
      for (let day of range.by('day')) {     // range = 2/9/18 to 30/9/18
        for (let i = 0; i < Math.floor(Math.random() * 6) + 1; i++) {
          var startQ = Math.floor(Math.random() * 24 * 4) + 1;
          var endQ = startQ + Math.floor(Math.random() * ((24 * 4) - startQ)) + 1;
          //          console.log( day.clone().toDate() );  // convert to date / time at this moment
          this.events.push({
            dateStart: day.clone().add(startQ / 4.0 * 3600, 'seconds').toDate(),
            dateEnd: day.clone().add(endQ / 4.0 * 3600, 'seconds').toDate(),
            styleClass: null,
            calendarName: calendars[Math.floor(Math.random() * 3)],        // event name with color
            summary: titles[Math.floor(Math.random() * titles.length)],
            description: descriptions[Math.floor(Math.random() * descriptions.length)],
            location: locations[Math.floor(Math.random() * locations.length)]
          });
 //         this.events.push(this.todayevent);
        }
      }
    }  
  }
});

const CalendarDetail = Vue.component('calendarDetail', {
  props: { 'id':   {type: String },
           'item': {type: Object } },
  template: ` 
  <v-container fluid grid-list-lg class="mt-0">
    <v-layout row wrap>
      <v-flex xs12>
        <v-card tile>
          <!--v-card-media :src="item.imageURL" contain>
          </v-card-media-->
          <v-carousel hide-delimiters class="mycarousel">
              <v-carousel-item :src="item.imageURL"></v-carousel-item>
          </v-carousel>
          <v-card-title primary-title>
            <div>
              <h3 class="headline">{{ item.title }}</h3>
              <div class="subheading pl-0">
                <v-icon>location_on</v-icon>&nbsp;{{ item.location }}
              </div>
              <v-flex xs12 class="pl-0">
                  <v-icon>event</v-icon>
                  <span class="body-1">{{ item.date }}  {{ item.hour }}</span>
              </v-flex>
              <v-flex xs12 class="grey--text text--darken-1 pl-0">
                <v-icon class="grey--text text--lighten-1">supervisor_account</v-icon>
                <span class="body-1">&nbsp;{{ item.joined }} People Joined</span>
              </v-flex>
              <div v-if="item.desc" v-html="item.desc"></div>
            </div>
          </v-card-title>
          <v-card-actions>
            <v-btn flat>Share</v-btn>
            <v-btn flat to="/calendar">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
  `,
});

const Calendar = Vue.component('calendar', {
  template: ` 
  <v-container fluid grid-list-lg class="mt-0">
    <v-layout row wrap>
      <v-flex xs12 md6 v-for="item in list" :key="item.id">
        <v-card tile>
          <v-card-media class="white--text" :src="item.imageURL" height="200px">
            <v-container fluid class="mb-0 pl-2 pb-2">
              <v-layout><v-flex xs12><v-icon x-large dark>event</v-icon><span class="subheading">{{ item.date }} {{ item.hour }}</span></v-flex></v-layout>
            </v-container>
          </v-card-media>

          <v-card-title primary-title>
            <div>
              <h3 class="headline">{{ item.title }}</h3>
              <div class="subheading pl-0"><v-icon>location_on</v-icon>&nbsp;{{ item.location }}</div>
              <v-flex xs12 class="grey--text text--darken-1 pl-0">
                <v-icon class="grey--text text--lighten-1">supervisor_account</v-icon>
                <span class="body-1">&nbsp;{{ item.joined }} People Joined</span>
              </v-flex>
            </div>
          </v-card-title>
          
          <v-card-actions>
            <v-btn flat>Share</v-btn>
            <v-btn flat :to="{ name:'CalendarDetail', params: { id:item.id, item:item } }" >View Detail</v-btn>
            <v-btn flat :to="{ name:'calendarTest' }" >Week Appointments</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>   
  `,
  data() { 
    return {
      list: [ { id: 1, title: "Ceremony at Monkey Forest", location: "Alas Kedaton, Tabanan", date: "18 Mar 2018", hour: "14:00 PM", joined: 32,
            imageURL: "https://c2.staticflickr.com/8/7390/11206634984_44f61f926d.jpg",
            desc: "The temple ceremony in Alas Kedaton Temple is carried out every 210 days a year. It is on <i>Anggarakasih Medangsia</i> (Balinese Hindu calendar) or on every Tuesday where on that time the society do the worship or pray to request the safety and prosperity. The unique in this ceremony is do not use the fire and do not hence Penjor and also finished before the sunset or before the night is come."
              },
              { id: 2, title: "Pandanus War", location: "Tenganan Pegeringsingan, Karangasem", date: "20 Jul 2018", hour: "10:00 AM", joined: 40,
            imageURL: "https://c2.staticflickr.com/6/5331/17634071142_152c806768.jpg",
            desc: "Pandanus War or localy known as <i>Mekare-kare</i> is an annual theatrical fight between the young men of the village, utilising prickly pandanus leaf whips! Each dual is staged to the intense martial sounds of <i>gamelan selonding</i> music, and lasts only a few seconds, accompanied by much merriment and laughter."
              },
              { id: 3, title: "Bali Mass Cremation", location: "Tampaksiring, Gianyar", date: "6 Aug 2018", hour: "09:00 AM", joined: 10,
            imageURL: "https://c1.staticflickr.com/9/8713/17470094589_0f1fd7c67f.jpg",
            desc: "Cremation is guiding the soul of the deceased family member from hell and underworld to divine realms, later to be reborn in the next generation of the same family. Long preparations proceed cremation ceremonies.<br>Each family uses a certain type of sarcophagus, sculptures formed as mythical animals, according to their cast. A black or white bull is used for a Brahman cast, together with a tower-shaped sarcophage called bade, with roofs like a pagode."
              },
              { id: 4, title: "Makepung Lampit", location: "Yeh Peh, Jembrana", date: "18 Nov 2018", hour: "07:00 AM", joined: 24,
            imageURL: "https://c1.staticflickr.com/9/8117/8678393979_1997fecfe8.jpg",
            desc: "Makepung Lampit is a kind of buffalo race without using the wheel as often held now in Jembrana district of Bali, but using the thing called <i>Lampit</i>. Lampit is a tool to flatten rice fields before planting. <br>Makepung Lampit have started to be implemented since the 1940 and stopped around 1990 after the available machines such as tractors to plow rice fields."
          }
        ],
    }
  },
  created() { 
    this.getAllData();  
  },
  methods: {
    getAllData() {
/*      
      console.log("1) getAllData:"+this.organiser);
      this.result = 'Getting data from server...';
      var postdata = { op: "getDayGames", key: [this.organiser, this.date] };
      this.$http.post('php/apiGame.php', JSON.stringify(postdata), {
          headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.games = response.body.data;
          console.log('91) betNgame > getalldata');
          console.log(this.games);
        },      response => { this.result = 'Failed to load data to server.';
      });

*/   

    },
  }        // methods 
  //==================================================
});  

