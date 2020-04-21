// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false


import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap'

//import WVueEmoji from "w-vue-emoji"
// Vue.use(WVueEmoji)


//引入jQuery
import jquery from 'jquery'
Vue.prototype.$jquery=jquery;

// import 'jquery-emoji'

// import jquery from "../static/jquery-emoji/lib/script/jquery.min.js"
//import mousewheel from "../static/jquery-emoji/lib/script/jquery.mousewheel-3.0.6.min.js"
// import mCustomScrollbar from "../static/jquery-emoji/lib/script/jquery.mCustomScrollbar.min.js"

//引入element-ui
import ElementUI from 'element-ui'
import "element-ui/lib/theme-chalk/index.css" //导入css文件
Vue.use(ElementUI)

//引入axios
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8080/api';//端口设置
Vue.prototype.$http=axios; //将axios改写到vue原型属性,调用方式例如this.$http.post(xxx)

//引入qs
import qs from "qs"
Vue.prototype.$qs=qs

//引入vue自定义右键菜单
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'
Vue.use(contentmenu)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
