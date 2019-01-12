<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Starpunter(19-1-12)</title>

  <link href="/css/bootstrap.css" rel="stylesheet">
  <link href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/vuetify/1.3.4/vuetify.css" rel="stylesheet">

    <link  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css" rel="stylesheet">
    <link  href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css" rel="stylesheet">

  <link href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.7/semantic.min.css" rel="stylesheet"
  media="screen" title="no title" charset="utf-8">   
    <link href="/css/AdminLTE.min.css" rel="stylesheet">
    <link href="/css/skin-blue.min.css" rel="stylesheet">
    <link href="/css/mycss.css" rel="stylesheet">            <!-- customised -->
    <link href="/css/vuedraggable.css" rel="stylesheet">      <!-- customised -->
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
</head>
<body class="hold-transition skin-blue sidebar-mini" style="overflow-y:scroll">
<div id="app">
  <v-app> 
    <router-view></router-view>
  </v-app>
</div>

<script src="https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue-resource@1.5.1"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.10/lodash.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vuetify@1.3.4/dist/vuetify.min.js"></script>
<script src="https://cdn.jsdelivr.net/combine/npm/vuetify@1.3.4,npm/sweetalert2@7.28.12"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.10/lodash.min.js"></script>
<script src='lib/moment.js'></script>
<script src="lib/accounting.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/numeral.min.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/vue-router/3.0.2/vue-router.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vuex/3.0.1/vuex.min.js"></script>

<script src="//cdn.jsdelivr.net/npm/sortablejs@1.7.0/Sortable.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/Vue.Draggable/2.16.0/vuedraggable.min.js"></script>
<script src="/lib/vue-echarts.js"></script>

<script src="components/compbarsV2.js"></script>
<!-- script src="components/compbars.js"></script  -->
<script src="components/complogin.js"></script>
<script src="components/compregister.js"></script>

<script src="components/game2tables.js"></script>

<script src="components/dialogbet.js"></script>
<script src="components/compBasketball.js"></script>
<script src="components/comp2GameNtop.js"></script>       <!-- 1) top n games (include h2h)-->
<script src="components/comp2BetOdds.js"></script>       <!-- 2) odd based games -->

<script src="components/bet2BetPools.js"></script>       <!-- 4) contestant list for the week -->
<script src="components/bet2Calendar.js"></script>
<script src="components/bet2GamePools.js"></script>

<script src="components/compNRL.js"></script>
<script src="components/compproduct.js"></script>

<!-- script src="https://unpkg.com/vue@2.5.21/dist/vue.min.js"></script  -->
<script src="https://unpkg.com/showdown@1.9.0/dist/showdown.min.js"></script>
<script src="https://unpkg.com/vue-showdown@2.3.0/dist/vue-showdown.min.js"></script>

<script src="components/compfaqs.js"></script>

<script src="components/compfeeds.js"></script>
<script src="components/customerrequest.js"></script>

<script src="components/comppools.js"></script>
<script src="components/compusers.js"></script>

<script src="//cdn.jsdelivr.net/alasql/0.2/alasql.min.js"></script> 
<script src='/components/chartComp.js'></script>      <!-- summaryUsers.js -->

<script src="components/summarycomps.js"></script>    
<script src="components/summaryPool.js"></script>       <!-- manager (pool table) identify winners (poolResults) -->
<script src="components/summaryGames.js"></script>    
<script src="components/summaryUsers.js"></script>      
<script src="components/gameResults.js"></script>       <!-- manager (game table) input scores -->
<script src="components/poolResults.js"></script>      <!-- manager (game table) identify winners -->
<script src="components/betMyResults.js"></script>     <!-- customer (bet table)-->
<script src="components/betLeaders.js"></script>       <!-- customer -->

<script src="components/buyticket.js"></script>       <!-- buy tickets -->
<script src="components/servicebet.js"></script>      <!-- place bets -->
<script src="components/serviceticket.js"></script>   <!-- manage tickets (from customerinfo) -->
<script src="components/cashbalance.js"></script>

<script src="components/comprequest.js"></script>       <!-- 1) cash withdrawal & withdrawal history -->
<script src="components/statement.js"></script>        <!-- 2) betting transations (vcash) -->

<script src="components/betgames.js"></script>
<script src="components/customerinfo.js"></script>

<script src='lib/moment-range.js'></script>
<script src='lib/vue-fullcalendar.min.js'></script>
<script src="lib/sha256.js"></script> 

<!-- system maintenance modules -->
<script src='/components/syspool.js'></script>      
<script src='/components/sysusermgr.js'></script>
<script src='/components/sysuser.js'></script>  
<!-- ******************************************************************************** -->
<script src="components/homeuser.js"></script>      <!-- home for a user -->
<script src="components/homegame.js"></script>      <!-- home for a game -->
<script src="components/homegames.js"></script>      <!-- new home 2 -->
<script src="components/homepools.js"></script>      <!-- new home 2 -->

<script src="components/homecalendar.js"></script>
<script src="components/homeinfo.js"></script>
<script src="js/main.js"></script>  

</body>
</html>
