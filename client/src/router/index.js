import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Charts from '@/components/Charts'
import Keyboard from '@/components/Keyboard'
import Dashboard from '@/pages/Dashboard'
import Login from '@/pages/Login'
import Registration from '@/pages/Registration'
import MathEditor from "@/components/MathEditor";
import MathEditor2 from "@/components/MathEditor2";

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/keyboard',
            name: 'keyboard',
            component: Keyboard,
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
        },
        {
            path: '/registration',
            name: 'registration',
            component: Registration,
        },
        {
            path: '/',
            name: 'dashboard',
            component: Dashboard,
            children: [
                {
                    path: '/home',
                    name: 'Home',
                    component: Home
                },
                {
                    path: '/charts',
                    name: 'Charts',
                    component: Charts
                },
                {
                    path: '/answersheet',
                    name: 'AnswerSheet',
                    props: true,
                    component: MathEditor
                },
                {
                    path: '/answersheet2',
                    name: 'AnswerSheet2',
                    props: true,
                    component: MathEditor2
                }

            ],
        },

    ]
})