Vue.filter('currency', function(val, dec) {
    return accounting.formatMoney(val, '$', dec)
});
Vue.filter('number', function(val, dec) {
    return accounting.formatNumber(val, dec, ',', '.')
});
const Product = Vue.component('productcomponent', {
  template: `
    <div>
    <v-toolbar color="cyan" dark tabs>
      <v-toolbar-side-icon><img src="images/tristars2.png" width="70" height="40"></v-toolbar-side-icon>
      <v-toolbar-title>AFL Tournaments</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon href="/checkout.html"><v-icon>shopping_cart</v-icon></v-btn>
      <v-btn icon href="/profile.html"><v-icon>folder_open</v-icon></v-btn>

      <v-btn color="success" href="/apiUser.html">Users<v-icon>account_box</v-icon></v-btn>
      <v-btn color="warning" href="/apiProduct.html">New Products<v-icon>directions_run</v-icon></v-btn>
      <v-btn color="info" href="/apiTournament.html">Games<v-icon>directions_run</v-icon></v-btn>
      <v-btn color="warning" href="/apiCustomer.html">Customer Profile<v-icon>account_box</v-icon></v-btn>      
      <v-btn color="error" href="/apiRegister.html">Sign Up<v-icon>how_to_reg</v-icon></v-btn>
      <v-btn color="success" href="/apiLogin.html">Sign in<v-icon>input</v-icon></v-btn>
      <v-btn color="info" href="/apiLogin.html">Log out<v-icon>logout</v-icon></v-btn>
      <v-btn icon><v-icon>search</v-icon></v-btn>
      <v-btn icon><v-icon>more_vert</v-icon></v-btn>
      <v-tabs slot="extension" color="cyan" align-with-title>
        <v-tabs-slider color="yellow"></v-tabs-slider>
        <v-tab v-for="item in items" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>
    </v-toolbar>
    <v-tabs-items>
    <v-tab-item>
      <v-layout column>
        <v-flex xs12 sm6 offset-sm3>  
          <v-toolbar color="pink" dark><v-toolbar-title>Product Management</v-toolbar-title></v-toolbar>
          <v-card>
            <v-container fluid grid-list-md>
              <v-layout row wrap>
                <v-flex xs6>
                  <v-card dark color="primary">
                    <form name="form" v-on:submit.prevent="save" novalidate>
                      <div>
                        <div class="form-group">
                          <input type="hidden" v-model="product.id">
                          <label class="control-label" for="name">Product Name:</label>
                          <input class="form-control" type="text" id="name" v-model='product.name' placeholder="Name">
                        </div>
                        <div class="form-group">
                          <label class="control-label" for="price">Price:</label>
                          <input class="form-control" type="text" id="price" v-model='product.price'  placeholder="Price">
                        </div>
                        <div  class="form-group"><span class="badge badge-danger">{{error}}</span></div>
                        <div  class="form-group"><button class="btn btn-primary">Save</button>Status: {{ result }}</div>
                      </div>
                      <br>
                      <p><button v-on:click="getAllData" class="btn btn-danger">Fetch Data from Server</button></p>  
                    </form>
                  </v-card>
                </v-flex>
                <v-flex xs6>
                  <v-card dark color="secondary">
                    <table class="table table-striped">
                      <thead><tr><th>Name</th><th>Price</th><th>Action</th></tr></thead>
                      <tbody>
                        <tr v-for="item in products">
                          <td>{{ item.name }}</td><td>{{ item.price | number(2) }}</td>
                          <td><a href="javascript:void(0)" v-on:click="editItem(item)">edit</a> |
                            <a href="javascript:void(0)" v-on:click="deleteItem(item)">delete</a></td>
                        </tr>
                      </tbody>
                    </table>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-tab-item>
  </v-tabs-items>
</div>
`,
    data () {
      return {
        text: "Tan",
        items: [ 'Product', 'shopping', 'videos', 'images', 'news'],
        result: '',
        error: '',
        product: { id: 0, name: '', price: '' },
        products: []
      }
    },
    methods: {
        save: function () {
            if(this.product.name=='' || this.product.price==''){
                this.error = 'Name and price fields are required';
                return;
            }
            this.error = '';
            this.result = 'Saving data to server...';
            var postdata = { "op": "save", "data": this.product };
            //console.log(JSON.stringify(postdata));
            this.$http.post('php/apiProduct.php', postdata,{
                headers: { 'Content-Type': 'application/json' }
            }).then(response => {
                this.result = response.body;
                this.product.id = 0;
                this.product.name = '';
                this.product.price = '';
            }, response => {
                    this.result = 'Failed to save data to server.';
            });
        },
        editItem: function(item){
            this.product.id = item.id;
            this.product.name = item.name;
            this.product.price = item.price;
        },
        deleteItem: function(item){
            var r = confirm("Are you sure to delete this item ("+item.name+ ")?");
            if(r==true) {
                this.result = 'Deleting data to server...';
                var postdata = { op: "delete", id: item.id };
                this.$http.post('php/apiProduct.php', JSON.stringify(postdata),{
                    headers: { 'Content-Type': 'application/json' }
                }).then(response => { this.result = response.body;
                }, response => { this.result = 'Failed to delete data.';
                });
            }
        },
        getAllData: function () {
            this.result = 'Getting data to server...';
            var postdata = { op: "getProducts" };
            this.$http.post('php/apiProduct.php', JSON.stringify(postdata), {
                headers: { 'Content-Type': 'application/json' }
            }).then(response => {
                this.result = '';
                this.products = response.body.data;
            }, response => { this.result = 'Failed to load data to server.';
            });
        }
    },
    beforeMount(){ this.getAllData(); }
});
