// src/plugins/MyGlobalFilters.js
import Vue from 'vue'
import accounting from 'accounting'
//----------------------------------
// news-feed
Vue.filter('maxText', function (text) {
  // remove html
  text = text.replace(/<.*?>/gi, '')
  if (text.length > 500) text = text.substr(0, 500)
  return text
})
Vue.filter('dtFormat', function (s) {
  if (!window.Intl) return s
  // convert to date
  if (!(s instanceof Date)) {
    let orig = s
    s = new Date(s)
    if (s === 'Invalid Date') return orig
  }
  return new Intl.DateTimeFormat().format(s)
})
//------------------------------------
// formatting
Vue.filter('currency', function (val, dec) { return accounting.formatMoney(val, '$', dec) })
Vue.filter('number', function (val, dec) { return accounting.formatNumber(val, dec, ',', '.') })
