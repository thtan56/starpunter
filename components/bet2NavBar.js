// 1) general public
// 2) need v-bind :myrole in line 10
// 3)   where as role="guest" in index.html (cannot v-bind, otherwise problem)
Vue.component('Tnavbar', {
  template: `
  <section class="menu">
    <v-toolbar color="cyan" dark tabs>
      <v-toolbar-side-icon><img src="images/tristars2.png" width="70" height="40"></v-toolbar-side-icon>
      <v-toolbar-title>Tournament</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn icon href="/checkout.html"><v-icon>shopping_cart</v-icon></v-btn>
        <v-btn icon href="/profile.html"><v-icon>folder_open</v-icon></v-btn>

        <v-btn color="success" href="/apiUser.html">Users<v-icon>account_box</v-icon></v-btn>
        <v-btn color="warning" href="/apiProduct.html">Products<v-icon>directions_run</v-icon></v-btn>
        <v-btn color="info" href="/apiTournament.html#/organiser/NBA">Games<v-icon>directions_run</v-icon></v-btn>
        <v-btn color="warning" href="/apiCustomer.html">Customer<v-icon>account_box</v-icon></v-btn>      
        <v-btn color="error"   to="/signup">Sign Up<v-icon>how_to_reg</v-icon></v-btn>
        <v-btn color="success" to="/login">Sign in<v-icon>input</v-icon></v-btn>
        <v-btn color="info"    to="/login">Log out<v-icon>logout</v-icon></v-btn>
        <v-btn icon><v-icon>search</v-icon></v-btn>
        <v-btn icon><v-icon>more_vert</v-icon></v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <div>
      <v-tabs v-model="active" color="teal" dark slider-color="yellow">
        <v-tab to="/organiser/NBA">NBA<v-icon>pets</v-icon></v-tab>
        <v-tab to="/organiser/NBL">NBL<v-icon>pets</v-icon></v-tab>  
        <v-tab to="/organiser/AFL">AFL<v-icon>pets</v-icon></v-tab>
        <v-tab to="/organiser/NFL">NFL<v-icon>pets</v-icon></v-tab> 
        <v-tab to="/organiser/Asian Games">Asian Games<v-icon>pets</v-icon></v-tab>            
        <v-tab to="/Summary">Summary<v-icon>pets</v-icon></v-tab>  
        <v-tab to="/calendar">Calendar<v-icon>calendar_view_day</v-icon></v-tab>   
        <v-tab to="/Breakfast">Breakfast<v-icon>motorcycle</v-icon></v-tab>
        <v-tab to="/NBL">NBL2<v-icon>pets</v-icon></v-tab>   
      </v-tabs>
      <v-tabs v-model="active" color="blue" dark slider-color="yellow">

        <v-card color="blue">
          <v-card-text>** Calendar **</v-card-text>
        </v-card>

        <v-tab to="/calendar/NBA">NBA<v-icon>calendar_view_day</v-icon></v-tab>
        <v-tab to="/calendar/NBL">NBL<v-icon>calendar_view_day</v-icon></v-tab>  
        <v-tab to="/calendar/AFL">AFL<v-icon>calendar_view_day</v-icon></v-tab>
        <v-tab to="/calendar/NFL">NFL<v-icon>calendar_view_day</v-icon></v-tab> 
        <v-tab to="/calendar/Asian Games">Asian Games<v-icon>calendar_view_day</v-icon></v-tab>            
      </v-tabs>
    </div>
  </section>
  `,
  data() { 
    return {
      active: null
    }
  }
});