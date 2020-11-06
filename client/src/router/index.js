import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Charts from '@/components/Charts'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/charts',
            name: 'Charts',
            component: Charts
        },
        {
            path: '/charts/:id',
            name: 'Charts',
            props: true,
            component: Charts
        }
    ]
})