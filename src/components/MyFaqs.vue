// const myfaqs=Vue.component('faqsComponent', {
<template>
  <v-content>
    <homebars></homebars>
    <sidebar></sidebar>
    <v-container fluid grid-list-md>
      <VueShowdown :markdown="fileContent" flavor="github"
                :option="{ emoji: true}"
      ></VueShowdown>
    </v-container>
  </v-content>
</template>

<script>
import sidebar from './SideBar.vue'
import homebars from './HomeBars.vue'
// VueShowdown setup in main.js
export default {
  name: 'myFaqs',
  props: { fileToRender: { type: String, default: '10_homepage.md' } },
  components: { sidebar, homebars },   // 2
  data: function() {
    return {
      fileContent: null,
      // fileToRender: "faqs/toc.md",
      fileToRender2:
        "https://gist.githubusercontent.com/rt2zz/e0a1d6ab2682d2c47746950b84c0b6ee/raw/83b8b4814c3417111b9b9bef86a552608506603e/markdown-sample.md",        
      rawContent: null
    };
  },

  methods: {
    getContent() {
      var filename = '/faqs/' + this.fileToRender;
      console.log("10) getContent: fileToRender", this.fileToRender);
      console.log("12) filename:", filename);
      this.fileContent = "rendering ";
      // var self;

      this.$http.get(filename).then(
        response => { this.fileContent = response.body; },
        response => { this.fileContent = "An error ocurred"; }
      );
    }
  },
  watch: { 
    fileToRender (newVal, oldVal)  { this.getContent(); } // need for new selection,
                                                          // created for 1st time call
  },
  created: function() {
    //  const fileToRender = `./assets/documentation/general/welcome.md`;
    //const rawContent = ""; // Read the file content using fileToRender
    // this.fileContent = "### marked(rawContent) should get executed";
    this.getContent();
  },  
};
</script>
