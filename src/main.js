import Vue from 'vue'
import App from './App.vue'
import router from './router'
import MintUI from 'mint-ui'
import vuex from 'vuex'

import 'mint-ui/lib/style.css'
import 'font-awesome/css/font-awesome.min.css'
import {get, post} from "./utils/request";

Vue.config.productionTip = false
Vue.use(MintUI)
Vue.use(vuex)
Vue.prototype.$get = get;
Vue.prototype.$post = post;
let store = new vuex.Store({//store对象
    state:{
        detail:{},
        info:{},
        way:null,
        fanid:null,
        userInfo:{}
    }
});

new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app')
