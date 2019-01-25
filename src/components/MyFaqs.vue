// const myfaqs=Vue.component('faqsComponent', {
<template>
  <v-content>
    <topmenu></topmenu>
    <v-container fluid grid-list-md>
      <VueShowdown :markdown="fileContent" flavor="github"
                :option="{ emoji: true}"
      ></VueShowdown>
    </v-container>
  </v-content>
</template>

<script>
import topmenu from './TopMenu.vue'
// VueShowdown setup in main.js
export default {
  name: 'myfaqs',
  components: { topmenu },   // 2
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
};
</script>
