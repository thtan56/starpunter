import Vue from 'vue'
import Router from 'vue-router'
import Register from '../components/Register.vue'
import Login from '../components/Login.vue'
import Password from '../components/Password.vue'
import Games from '../components/Games.vue'
import Pools from '../components/Pools.vue'
import Echart1 from '../components/Echart1.vue'
import UsersCashChart from '../components/UsersCashChart.vue'
import Form from '../components/Form.vue'
import PoolSummary from '../components/PoolSummary.vue'
import GameSummary from '../components/GameSummary.vue'
import TicketSummary from '../components/TicketSummary.vue'
import userSummary2 from '../components/UserSummary2.vue'
import userSummary from '../components/UserSummary.vue'
import sysUser from '../components/SysUser.vue'
import statement from '../components/Statement.vue'
import myfaqs from '../components/MyFaqs.vue'
import homeCalendar from '../components/HomeCalendar.vue'
import buyTicket from '../components/BuyTicket.vue'
import ticketStatus from '../components/TicketStatus.vue'
import betStatus from '../components/BetStatus.vue'
import requestStatus from '../components/RequestStatus.vue'
import request from '../components/Request.vue'
import placeBet from '../components/PlaceBet.vue'
import poolResults from '../components/PoolResults.vue'
import gameResults from '../components/GameResults.vue'
import betMyResults from '../components/BetMyResults.vue'
import betLeaders from '../components/BetLeaders.vue'
import betPools from '../components/BetPools.vue'
import betOdds from '../components/BetOdds.vue'
import nGames from '../components/Ngames.vue'
import cashBalance from '../components/CashBalance.vue'
import poolList from '../components/PoolList.vue'
import gameTable from '../components/GameTable.vue'
import gameCalendar from '../components/GameCalendar.vue'
import betGames from '../components/BetGames.vue'
import homeGames from '../components/HomeGames.vue'
import gameHome from '../components/GameHome.vue'
import poolManager from '../components/PoolManager.vue'
import userHome from '../components/UserHome.vue'
import userManager from '../components/UserManager.vue'
import nbaBet from '../components/NbaBet.vue'
import nblBet from '../components/NblBet.vue'
import nrlComponent from '../components/NrlComponent.vue'
import NBAnews from '../components/NBAnews.vue'
import AFLnews from '../components/AFLnews.vue'
import dragTest from '../components/DragTest.vue'
import Home from '../components/Home.vue'
import loginCustomer from '../components/LoginCustomer.vue'
import loginManager from '../components/LoginManager.vue'
//     component         filename
Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'Home', component: Home},
    { path: '/user', component: loginCustomer },
    { path: '/manager', component: loginManager},   
    { path: '/homecalendar', component: homeCalendar },
    { path: '/betPools', component: betPools }, // 2) nTop games WIP
    { path: '/betOdds', component: betOdds }, // 2) nTop games
    { path: '/gameH2H', component: nGames }, // 2) nTop games
    { path: '/cashbalance', component: cashBalance }, // 3e)
    // { path: '/vcashbalance', component: vcashBalance }, // 3f)

    { path: '/register', name: 'Register', component: Register },
    { path: '/signup', component: Register },
    { path: '/login', name: 'Login', component: Login },
    { path: '/password/:activity', component: Password, props: true },

    { path: '/request/:activity', component: request, props: true }, // 3a) withdraw, deposit, buy, sell (components/compcash)
    { path: '/requeststatus/:activity', component: requestStatus, props: true }, // 3a) withdraw, deposit status (history)
    { path: '/ticket/buy', component: buyTicket }, // 3c) buy scheme based tickets to place bet (components/serviceaccount)
    { path: '/ticket/status', component: ticketStatus }, //     status & history
    { path: '/bet/dragdrop', component: placeBet }, // 3d) drag & drop game to certain ticket (components/serviceaccount)
    { path: '/bet/status', component: betStatus }, // status & history (with deletion)
    { path: '/ticketSummary', name: 'ticketSummary', component: TicketSummary }, // manager
    { path: '/gameSummary', name: 'gameSummary', component: GameSummary }, // manager
    { path: '/poolSummary', name: 'poolSummary', component: PoolSummary }, // manager
    { path: '/userSummary2', name: 'userSummary2', component: userSummary2 }, // manager
    { path: '/userSummary', name: 'userSummary', component: userSummary, props: true },
    { path: '/poolResults', component: poolResults }, // manager  ?????
    { path: '/gameResults', component: gameResults }, // manager
    { path: '/bet/MyResults', component: betMyResults }, // customer
    { path: '/bet/Leaders', component: betLeaders }, // customer

    { path: '/games', name: 'Games', component: Games },
    { path: '/pools', name: 'Pools', component: Pools },
    { path: '/echart1', name: 'Echart1', component: Echart1 },
    { path: '/echart2', name: 'UsersCashChart', component: UsersCashChart },
    { path: '/form', name: 'Form', component: Form, props: true },
    //  { path: '/user/:userId', name: 'secured', component: loginCustomer },
    { path: '/user/:username', name: 'sysuser', component: sysUser, props: true },
    { path: '/statement', name: 'soa', component: statement }, // statements.js, withdraw, deposit status (history)

    { path: '/game/:organiser', component: gameTable, props: true },
    { path: '/calendar/:organiser', component: gameCalendar, props: true },
    { path: '/pools/:gameid', name: 'GamePools', component: poolList, props: true },

    { path: '/betgames/:ticketid', name: 'betGames', component: betGames, props: true },
    { path: '/homegames/:username', name: 'homeGames', component: homeGames, props: true },
    { path: '/gamehome/:game_id', name: 'gameHome', component: gameHome, props: true },
    { path: '/userhome/:username', name: 'userHome', component: userHome, props: true },
    { path: '/usermanager', component: userManager }, // components/customerinfo.js
    { path: '/poolmanager', component: poolManager },
    { path: '/sysmanager', beforeEnter () { location.href = 'sysManager.html' } },

    { path: '/schedule/game', beforeEnter () { location.href = 'fcGame.html' } },
    { path: '/schedule/period', beforeEnter () { location.href = 'fcPeriod.html' } },

    { path: '/basketballNBL', component: nblBet },
    { path: '/basketballNBA', component: nbaBet },
    // { path: '/AG2018Bas', component: asiaBet },
    { path: '/gameNRL', component: nrlComponent },
    // { path: '/product', component: Product },
    { path: '/newsNBA', component: NBAnews },
    { path: '/newsAFL', component: AFLnews },
    { path: '/dragtest', component: dragTest }, 
    { path: '/faqs/:fileToRender', name: 'myFaqs', component: myfaqs, props: true },  // dynamic
    { path: '/howtoplay', component: myfaqs, props: { name: 'fileToRender'} } // static: use default  
  ]
 })
