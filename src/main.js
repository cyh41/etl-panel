// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex'

import 'normalize.css'
import Drag from './js/drag'

Vue.config.productionTip = false

Vue.directive('drag', {
  bind: function (el, binding) {
    new Drag(el,binding);
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})