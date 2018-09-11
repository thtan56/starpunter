Vue.filter('currency', function(val, dec) {
    return accounting.formatMoney(val, '$', dec)
});
Vue.filter('number', function(val, dec) {
    return accounting.formatNumber(val, dec, ',', '.')
});

const demo = new Vue({
    el: '#app',
    data: {
        text: "Tan",
        items: [ 'Product', 'shopping', 'videos', 'images', 'news'],
        result: '',
        error: '',
        product: { id: 0, name: '', price: '' },
        products: []
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
    beforeMount(){
        console.log('1) beforeMount: getAllData');
        this.getAllData(); }
});
