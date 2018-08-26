Vue.component('topbar', {
  template: `
    <nav class="navbar navbar-toggleable-md navbar-inverse"> 
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#mainNavBar" aria-expanded="false">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>                  
          </button>
          <a href="#" class="navbar-brand">TheNews</a>
        </div>

        <div class="collapse navbar-collapse" id="mainNavBar">
          <ul class="nav navbar-nav">
            <li class="active"><a href="index.html">Home</a></li>
            <li><a href="home.html">Home2</a></li> 
            <li><a href="http://basicwebsite.test/my-home">Dashboard</a></li>
            <li><a href="http://basicwebsite.test">Basic Website-Test</a></li>         
            <li><a href="filter.html">Sharpes Filter</a></li>
            <li><a href="grid.html">Bootstrap Table</a></li>            
            <li><a href="#">Contact</a></li>
            <!-- 3) drop down menu (investment summary ) -->
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown">Investment Summary<span class="caret"></span></a>
              <ul class="dropdown-menu">
                <li><a href="axios_prices.html">Canvas Chart - Vue 1</a>    </li>
                <li><a href="update_fav_report.html">Quarter Reports + Update</a></li>  
                <li></li>
                <li><a href="canvasjs_jqry1.html">Canvas Chart - Jquery 1</a></li>
                <li><a href="echarts1.html">eChart - Js</a>    </li>                
                <li><a href="vue-stocks.html">Stock List-Axios</a>  </li>
                <li><a href="php/html_update_AFL_report.php">AFL Weeekly Reports-Update</a></li>  
                <li><a href="php/phpinfo.php">phpinfo</a></li>
              </ul>
            </li>
            <!-- 4) drop down menu (test) -->
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown">AFL Tournaments<span class="caret"></span></a>
              <ul class="dropdown-menu">
                <li><a href="apiProduct.html">Product Management</a></li>  
                <li><a href="apiUser.html">User Management</a></li>  
                <li><a href="apiProfile.html">My Profile</a></li>  
              </ul>
            </li>
          </ul>
          <ul class="nav navbar-nav navbar-right"><li><a href="#">Setting</a></li><li><a href="#">Logout</a></li></ul>
        </div>
      </div>
    </nav>
  `
});
Vue.component('tabs', {
  template: `
    <div id="applicationContainer">
      <div id="navBarContainer" class="tabs navbar navbar-default">
          <ul class="nav navbar-nav">
            <li class="nav-link" :class="{ active: tab.isActive }" v-for="tab in tabs">
              <a href="#" @click="selectTab(tab)">{{ tab.name }}</a>
            </li>
          </ul>
        </div>

        <div id="tabContentContainer">
        <slot></slot>
        </div>
    </div>
  `,
  data()    { return { tabs: [] };        },
  created() { this.tabs = this.$children; },
  methods: {
    selectTab(selectedTab) {
      this.tabs.forEach(tab => {
        tab.isActive = (tab.name == selectedTab.name);
      })
    }
  }
});

Vue.component('tab', {
  template: `
    <div id="individualTabContentContainer" v-show="isActive" class="jumbotron"><slot></slot></div>
  `,  
  props: {
    name: { required: true },
    selected: { default: false }
  },
  data()    { return { isActive: false };    },
  mounted() { this.isActive = this.selected; }
});
