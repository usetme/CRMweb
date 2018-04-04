// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import 'babel-polyfill'
import router from './router'
import ElementUI from 'element-ui'
import VueDragging from 'vue-dragging'
Vue.use(VueDragging)
import Vuex from 'vuex'
Vue.use(Vuex)
import 'element-ui/lib/theme-chalk/index.css'
import QueryControl from './components/QueryControl'
Vue.component('cquery', QueryControl)
import InputControl from './components/InputControl'
Vue.component('cinput', InputControl)
import TextareaControl from './components/TextareaControl'
Vue.component('ctextarea', TextareaControl)
import InputNumberControl from './components/InputNumberControl'
Vue.component('cnumber', InputNumberControl)
import SelectControl from './components/SelectControl'
Vue.component('cselect', SelectControl)
import DatePickerControl from './components/DatePickerControl'
Vue.component('cdatepicker', DatePickerControl)
import HealthControl from './components/HealthControl'
Vue.component('chealth', HealthControl)
import CategoryControl from './components/CategoryControl'
Vue.component('ccategory', CategoryControl)
import CorpControl from './components/CorpControl'
Vue.component('ccorp', CorpControl)
import DeptControl from './components/DeptControl'
Vue.component('cdept', DeptControl)
import EmployeeControl from './components/EmployeeControl'
Vue.component('cemployee', EmployeeControl)
import ProductControl from './components/ProductControl'
Vue.component('cproduct', ProductControl)
import CustomerControl from './components/CustomerControl'
Vue.component('ccustomer', CustomerControl)
import UserControl from './components/UserControl'
Vue.component('cuser', UserControl)
import LabelControl from './components/LabelControl'
Vue.component('clabel', LabelControl)
import UIControl from './components/UIControl'
Vue.component('cui', UIControl)
import TableControl from './components/TableControl'
Vue.component('ctable', TableControl)
import FloatWindowControl from './components/FloatWindowControl'
Vue.component('cwindow', FloatWindowControl)
import PageAddControl from './components/PageAddControl.vue'
Vue.component('pageadd', PageAddControl)
import CConnectControl from './components/customer/ConnectControl.vue'
Vue.component('ccconnect', CConnectControl)
import CityControl from './components/CityControl.vue'
Vue.component('ccity', CityControl)
import MoreDetails from './customer/MoreDetailsPage.vue'
Vue.component('ccmore', MoreDetails)
import GradeControl from './components/GradeControl.vue'
Vue.component('cgrade', GradeControl)
import ItemControl from './components/ItemControl.vue'
Vue.component('citem', ItemControl)
import TabsControl from './components/TabsControl.vue'
Vue.component('ctabs', TabsControl)
import crighttabs from './components/RightTabsControl.vue'
Vue.component('crighttabs', crighttabs)
import Order from './customer/OrderTabItem.vue'
Vue.component('ctabs', TabsControl)
Vue.use(ElementUI)
// 注册全局焦点自定义指令
Vue.directive('focus', {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    el.focus()
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
