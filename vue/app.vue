<template>
  <div id="app" class="ui container">
    <h2>&lt;Vuetable-2&gt; Data mode</h2>
    <vuetable ref="vuetable" 
      :api-mode="false"
      :fields="fields"
      :data-total="dataCount"
      :data-manager="dataManager"
      pagination-path="pagination"
      :per-page="3"
      :css="css.table"
      @vuetable:pagination-data="onPaginationData"
    >
      <template slot="actions" slot-scope="props">
      <div class="table-button-container">
          <button class="btn btn-warning" @click="editRow(props.rowData)">
            <span class="glyphicon glyphicon-pencil"></span> Edit</button>&nbsp;&nbsp;
          <button class="btn btn-danger" @click="deleteRow(props.rowData)">
            <span class="glyphicon glyphicon-trash"></span> Delete</button>&nbsp;&nbsp;
      </div>
      </template>
    </vuetable>
    <vuetable-pagination ref="pagination" 
      class="pull-right"
      @vuetable-pagination:change-page="onChangePage"
    ></vuetable-pagination>
  </div>
</template>

<script>
import axios from "axios";
import _ from 'lodash';
import Vuetable from "vuetable-2";
import VuetablePagination from "./components/VuetablePaginationBootstrap";
import VuetableCssConfig from "./VuetableCssConfig";
import FieldsDef from "./FieldsDef";

export default {
  name: "App",
  components: {
    Vuetable,
    VuetablePagination
  },
  data() {
    return {
      fields: FieldsDef,
      css: VuetableCssConfig,
      localData: [],
      dataCount: 0,
      searchFor: ""
    };
  },
  computed: {
    /*httpOptions() {
    return {headers: {'Authorization': "my-token"}} //table props -> :http-options="httpOptions"
  },*/
  },
  watch: {
    localData (newVal, oldVal) {
      this.$refs.vuetable.refresh()
    }
  },
  created() {
    axios
      .get("https://vuetable.ratiw.net/api/users?per_page=100")
      .then(response => {
        this.localData = response.data.data;
      });
  },
  mounted() {
    this.$refs.vuetable.setData(this.localData);
    console.log("mounted: ", this.localData);
  },
  methods: {
    onPaginationData(paginationData) {
      this.$refs.pagination.setPaginationData(paginationData);
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page);
    },
    editRow(rowData) {
      alert("You clicked edit on" + JSON.stringify(rowData));
    },
    deleteRow(rowData) {
      alert("You clicked delete on" + JSON.stringify(rowData));
    },
    dataManager(sortOrder, pagination) {
      console.log("dataManager: ", sortOrder, pagination, this.localData);

      let data = this.localData;

      // account for search filter
      if (this.searchFor) {
        // the text should be case insensitive
        let txt = new RegExp(this.searchFor, "i");

        // search on name, email, and nickname
        data = _.filter(data, function(item) {
          return (
            item.name.search(txt) >= 0 ||
            item.email.search(txt) >= 0 ||
            item.nickname.search(txt) >= 0
          );
        });
      }

      // sortOrder can be empty, so we have to check for that as well
      if (sortOrder.length > 0) {
        console.log("orderBy:", sortOrder[0].sortField, sortOrder[0].direction);
        data = _.orderBy(data, sortOrder[0].sortField, sortOrder[0].direction);
      }

      // since the filter might affect the total number of records
      // we can ask Vuetable to recalculate the pagination for us
      // by calling makePagination(). this will make VuetablePagination
      // work just like in API mode
      pagination = this.$refs.vuetable.makePagination(data.length);

      // if you don't want to use pagination component, you can just
      // return the data array
      return {
        pagination: pagination,
        data: _.slice(data, pagination.from - 1, pagination.to)
      };
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 20px;
}
</style>
