Vue.component('gamefilter', {
  template: `
  <v-container fluid grid-list-md>
    <v-layout column>
      <v-toolbar color="pink" dark>
        <v-toolbar-title>Games Selection for the Week</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-card-title>
          <v-layout row wrap>
            Organiser:
            <template v-for="org in organisers">
              <input type="radio" :value="org" id="org" v-model="organiser" @click="check($event)"> {{org}}
            </template>
          </v-layout>
          <v-spacer></v-spacer>
        </v-card-title>
      </v-toolbar>
    </v-layout>
  </v-container>  
  `,

  data () {
    return {
      organiser: 'NBA',  
      organisers: ['NBA', 'NBL', 'NFL', 'AFL'],
    }
  },
  methods: {
    check: function(e) {
      if (e.target.checked) {
        console.log(e.target.value)
        this.organiser = e.target.value;
        console.log(this.organiser);
        this.$emit('check-filter',this.organiser, this.organiser, e.target.checked);
//        this.getAllData();
      }
    },

  } 
});
const gamelist = Vue.component('gamelist', {
  props: ['tasksCompleted', 'tasksNotCompleted'],
  template: `
  <div class="row">
    <div class="col-md-4 col-md-offset-2">
      <section class="list">
        <header>Game Events</header>
        <draggable  class ="dragArea"         v-model="games2" 
                :options="{group:'games2'}" :element="'article'" 
                @change ="update"           @add="onAdd($event, false)">
          <article class="card" v-for="(game, index) in games2" :key="game.id" :data-id="game.id">
            <header>{{index+1}}) {{game.name}} </header>
            <!-- header>{{index+1}}) {{game.home_team}} vs {{game.away_team}} </header -->
          </article>
        </draggable>
      </section>
    </div>
    <div class="col-md-4" col-md-off>   
      <section class="list">
        <header>Tickets</header>
        <draggable class="dragArea" v-model="tickets2" :options="{group:'tickets2'}" @change="log">            
            <article class="card" v-for="(element, index) in tickets2" :key="index">
               {{element.name}}</article>
        </draggable>
      </section>
    </div>
  </div>
  `,
  data () {
    return {
//      tickets2: this.tickets,
//      games2: this.games,
      tasksNotCompletedNew: this.tasksNotCompleted,
      tasksCompletedNew: this.tasksCompleted      
      
      editable: true,
      isDragging: false,
      delayedDragging: false
    }
  },    // end of data
  computed: {
    dragOptions() {
      return { animation: 0, group: "description", disabled: !this.editable, ghostClass: "ghost" };
    },
    listString() { 
      console.log("listString");
      console.log(this.games);        // myArray
      console.log(this.tickets);
      return JSON.stringify(this.list, null, 2);}, 
    list2String() {
      console.log("listString2");
      console.log(this.games);
      console.log(this.tickets);
      return JSON.stringify(this.list2, null, 2); }
  },
  watch: {
    isDragging(newValue) {
      console.log("isDragging");
      console.log(newValue);
      if (newValue) {
        this.delayedDragging = true;
        return;
      }
      this.$nextTick(() => {
        this.delayedDragging = false;
      });
    }
  },
  filters: { moment: function (date) { return moment(date).format('YYYY-MM-DD'); } },
  methods:{
    add: function(){      this.list.push({name:'Juan'}); },
    replace: function(){  this.list=[{name:'Edgard'}]},
    clone: function(el){  return {  name : el.name + ' cloned' } },
    log: function (evt){ console.log(evt) },
    handleChange() { console.log('changed'); },
    inputChanged(value) { this.activeNames = value; },
    getComponentData() {
      return {
        on: {
          change: this.handleChange,
          input: this.inputChanged
        },
        props: { value: this.activeNames }
      };
    },
    orderList() { this.list = this.list.sort((one, two) => { return one.order - two.order; }); },
    onMove({ relatedContext, draggedContext }) {
      console.log("onMove");
      console.log(relatedContext);
      console.log(draggedContext);
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;
      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      );
    },
    //=============================
    onAdd(event, status) {
//      let id = event.item.getAttribute('data-id');
//      axios.patch('/demos/tasks/' + id, {   status: status
//        }).then((response) => { console.log(response.data);
//        }).catch((error)   => { console.log(error);
//      })
    },
    update() {
      console.log("update");
      this.tasksNotCompletedNew.map((task, index) => { task.order = index + 1; });
      this.tasksCompletedNew.map((task, index)    => { task.order = index + 1; });
      let tasks = this.tasksNotCompletedNew.concat(this.tasksCompletedNew);
//      axios.put('/demos/tasks/updateAll', { tasks: tasks
//        }).then((response) => { console.log(response.data);
//        }).catch((error)   => { console.log(error);
//      })
    }
  } // end of methods
});
//const ticketlist = Vue.component('ticketcomponent', {
//  template: ` 
//    <div class="col-md-4">   
//      <section class="list">
//        <header>Tickets</header>
//        <draggable class="dragArea" v-model="tickets" :options="{group:'tickets'}" @change="log">
//            <div v-for="(element, index) in tickets" :key="index">{{element.name}}</div>
//        </draggable>
//      </section>
//    </div>
// `,
//  data () {    return { }  },
//  methods: {} 
//});
//=======================================================================
// create a root instance
new Vue({
  el: '#app',
  components: { 
//    gamelist,
    'game-filter': {
      template: ``
    } 
  },    // end of components
  data () {
    return {
      games2:[],
      games:[{name:"Juan", id:1}, 
        {name:"Edgard", id:2}, 
        {name:"Johnson", id:3} ],
      tickets:[{name:"Juan2", id:11}, 
        {name:"Edgard2", id:12}, 
        {name:"Johnson2", id:13} ],
      organiser: 'NBA',  
    }
  },
  methods:{
    //--------------------------------
    checkFilter(category, title, checked) {       // feedback from child component
      this.organiser=title;
//      this.getAllData();              // reload
    },
    getAllData: function () {
      this.result = 'Getting data from server...'; 
      var postdata = { op: "getOrgGames", id: this.organiser };    // name, date
      this.$http.post('php/apiGame.php', JSON.stringify(postdata), 
            { headers: { 'Content-Type': 'application/json' }
        }).then(response => { this.games = response.body.data;
        },      response => { this.result = 'Failed to load data to server.';
      });
    }
  },   // end of methods
  beforeMount(){
//    this.getAllData(); // 1st time
  }  
});   // Vue
