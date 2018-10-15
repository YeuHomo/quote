import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/index/:fanid/:way',
            name: 'index',
            component: () => import(/* webpackChunkName: "index" */ './views/index/index.vue')
        },
        {
            path: '/',
            name: 'home',
            component: () => import(/* webpackChunkName: "home" */ './views/home/home.vue')
        },
        {   //上传行驶证
            path: '/bindcar',
            name: 'bindcar',
            component: () => import(/* webpackChunkName: "bindcar" */ './views/bindcar/bindcar.vue')
        },
        {   //选择保险公司
            path: '/selectcompany',
            name: 'selectcompany',
            component: () => import(/* webpackChunkName: "selectcompany" */ './views/selectcompany/selectcompany.vue')
        },
        {   //选择险种
            path: '/adjustment',
            name: 'adjustment',
            component: () => import(/* webpackChunkName: "adjustment" */ './views/adjustment/adjustment.vue')
        },
        {   //结果
            path: '/result',
            name: 'result',
            component: () => import(/* webpackChunkName: "result" */ './views/result/result.vue')
        },
        {   //结果
            path: '/showdetail',
            name: 'showdetail',
            component: () => import(/* webpackChunkName: "showdetail" */ './views/showdetail/showdetail.vue')
        },
        {   //order
            path: '/order',
            name: 'order',
            component: () => import(/* webpackChunkName: "order" */ './views/order/order.vue')
        },
        {   //my
            path: '/my',
            name: 'my',
            component: () => import(/* webpackChunkName: "my" */ './views/my/my.vue')
        },
        {
            path: '/information',
            name: 'information',
            component: () => import(/* webpackChunkName: "information" */ './views/information/information.vue')
        },
        {
            path: '/about',
            name: 'about',
            component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
        },
    ]
})
