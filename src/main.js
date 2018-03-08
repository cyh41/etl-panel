// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex'

import 'normalize.css'
import Drag from './js/drag'

import Icon from 'vue-svg-icon/Icon.vue'
Vue.component('icon',Icon)

Vue.config.productionTip = false

Vue.directive('drag', {
  inserted: function (el, binding) {
    let drag = new Drag(el,binding);
  },
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
