const myfaqs=Vue.component('faqsComponent', {
  template: `
  <v-content>
    <topmenu></topmenu>
    <v-container fluid grid-list-md>
      <VueShowdown :markdown="fileContent" flavor="github"
                :option="{ emoji: true}"
      ></VueShowdown>
    </v-container>
  </v-content>
  `,
  data: function() {
    return {
      fileContent: null,
      fileToRender: "faqs/toc.md",
      fileToRender2:
        "https://gist.githubusercontent.com/rt2zz/e0a1d6ab2682d2c47746950b84c0b6ee/raw/83b8b4814c3417111b9b9bef86a552608506603e/markdown-sample.md",        
      rawContent: null
    };
  },
  created: function() {
    //  const fileToRender = `./assets/documentation/general/welcome.md`;
    //const rawContent = ""; // Read the file content using fileToRender
    // this.fileContent = "### marked(rawContent) should get executed";
    this.getContent();
  },
  methods: {
    getContent() {
      console.log("10) getContent");
      this.fileContent = "rendering ";
      // var self;
      this.$http.get(this.fileToRender).then(
        response => { this.fileContent = response.body; },
        response => { this.fileContent = "An error ocurred"; }
      );
    }
  }  
});

const FAQs = Vue.component('faqs', {
  template: `
  <v-content>
    <!-- navbars></navbars -->
    <v-container fluid grid-list-lg>
      <v-card dark color="blue-grey">
        <v-card-title><span class="headline">Frequently Ask Questions</span><v-spacer></v-spacer>
          <v-btn color="black" @click.native="newq">New Question</v-btn>
        </v-card-title>
        <v-card-text>
      
      <v-data-table :headers="tableheaders" :items="tabledata" :pagination.sync="pagination">
        <template slot="items" slot-scope="props"> 
          <td style="width: 5%;">{{ props.item.id }}</td>
          <td class="text-xs-left">{{ props.item.question }}
            <v-textarea outline v-model="props.item.answer" value=propsitem.answer></v-textarea>
          </td>
          <template v-if="role === 'manager'">      
            <td><v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                <v-icon small @click="deleteItem(props.item)">delete</v-icon>
            </td>
          </template>
        </template>
      </v-data-table>
            </v-card-text>
          </v-card>
        <!-- ====================================================== -->
         <v-dialog v-model="adddialog" max-width="1000px">
          <v-card dark color="blue-grey">
            <v-card-title><span class="headline">New Question</span></v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
      <v-flex xs12 sm12 md12><v-text-field v-model="addedItem.question" label="Question"></v-text-field></v-flex>            
      <v-flex xs12 sm12 md12>
        <v-textarea outline v-model="addedItem.answer" label="Answer" value=addedItem.answer hint="Hint text"></v-textarea>
      </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="black" flat @click.native="close2">Cancel</v-btn>
              <v-btn color="black" flat @click.native="save2">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- ========================================================= -->
        <v-dialog v-model="editdialog" max-width="1000px">
          <v-card dark color="blue-grey">
            <v-card-title><span class="headline">Edit Q&A</span></v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
      <v-flex xs12 sm12 md12><v-text-field v-model="editedItem.id" label="Id" readonly background-color="red"></v-text-field></v-flex>
      <v-flex xs12 sm12 md12><v-text-field v-model="editedItem.question" label="Question"></v-text-field></v-flex>            
      <v-flex xs12 sm12 md12>
        <v-textarea outline v-model="editedItem.answer" label="Answer" value=editedItem.answer hint="Hint text"></v-textarea>
      </v-flex>
                 </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" flat @click.native="close">Cancel</v-btn>
          <v-btn color="black" flat @click.native="save">Save</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
    </v-container>
  </v-content>
  `,
  data () {
    return {
      pagination: {
        page: 1,
        rowsPerPage: 3,
      },
      adddialog: false,
      editdialog: false,
      editedIndex: -1,
      editedItem: { id: '', question: '', answer: '' },
      addedItem: { id: 0, question: '', answers: '' },
      tableheaders: [   
        { text: 'Id', value: 'id' },
        { text: 'Question/Answer', value: 'question' }      
      ],
      tabledata: [],
      columns: [   
        { text: 'Subject', value: 'subject' },
        { text: 'Notes', value: 'notes' },   
        { text: 'Remarks', value: 'remarks'},         
      ],
      notes: [],
      search: '',
    }
  },
  created () {},
  computed: {
    role() {
      return this.$store.state.loginUser.role;
    },
  },
  methods: {
    getAllData() {
      let qry = 'database/json_faqs.php?id=1';
      axios.get(qry)
        .then(response => { 
          this.notes = response.data;        
          this.tabledata = JSON.parse(this.notes[0].notes);   // convert string to json
          for (let i=0; i < this.tabledata.length; i++) {
            this.tabledata[i]['id']=i;
          };
        })  
        .catch(error => { console.log(error) });  
    },
    customFilter(items, search, filter) { 
      if (search==='all') { return items; };
      return items.filter(row => filter(row["subject"], search)); 
    },
    editItem (item) {
      this.editedIndex = item.id;
      this.editedItem = Object.assign({}, item);
      this.editdialog = true;
    },
    deleteItem (item) {
      const index = item.id;
      var r = confirm('Are you sure you want to delete this item (' + this.tabledata[index].question + ') ?');
      if (r == true) {
        console.log("99)deleteItem:OK");
        this.tabledata.splice(index, 1);          // remove deleted item  
        let qry = 'database/json_faqs_post.php';
        axios.post(qry, { data: this.tabledata, id: 1 } )
          .then(response => { 
          });
      } 
    },
    newq () {
      this.adddialog = true;
    },
    save () {
      Object.assign(this.tabledata[this.editedIndex], this.editedItem); // update this.tabledata
      let qry = 'database/json_faqs_post.php';
      axios.post(qry, { data: this.tabledata, id: 1 } )
        .then(response => { 
        });  
      this.close();
    },
    save2 () {
      console.log('save2');
      let id = this.tabledata.length;
      this.addedItem.id =id;
      console.log(this.addedItem);
      console.log(id);

      this.tabledata.push(this.addedItem);
      console.log(this.tabledata);
      let qry = 'database/json_faqs_post.php';
      axios.post(qry, { data: this.tabledata, id: 1 } )
        .then(response => { 
        });
       
      this.close2();
    },
    //----------------------------------------
    close () {
      this.editdialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    close2 () {
      this.adddialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
  },
  beforeMount() { this.getAllData(); }
});
