<template>
  <div id="dashboard">

    <template>
      <sidebar-menu :menu="menu"
                    theme="white-theme"
                    :collapsed="collapsed">
        <div slot="header"><img src="https://res.cloudinary.com/ht3nqskad/image/upload/v1604808653/logo2.png" alt=""></div>
      </sidebar-menu>
    </template>

    <router-view/>

  </div>
</template>

<script>
import { SidebarMenu } from 'vue-sidebar-menu';
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css';

export default {
  name: 'Dashboard',
  components: {
    SidebarMenu,
  },
  data(){
    return {
      collapsed: true,
      menu: [
        {
          header: true,
          title: '离散数学教育支撑系统-学生端',
          hiddenOnCollapse: true
        },
        {
          href: '/charts',
          title: '用户',
          icon: 'fa fa-user'
        },
        // {
        //   href: '/charts',
        //   title: '题目',
        //   icon: 'fa fa-chart-area',
        //   // badge: {
        //   //   text: 'new',
        //   //   class: 'default-badge'
        //   // }
        // },
        {
          href: '/answersheet2',
          title: '答题卡',
          icon: 'fa fa-chart-area',
        },
        // {
        //   href: '/answersheet2',
        //   title: '答题卡2',
        //   icon: 'fa fa-chart-area',
        // }
      ]
    }
  },
  methods:{
    onCollapse (collapsed) {
      this.collapsed = collapsed
    },
  }

}
</script>

<style>

#dashboard {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: auto;
  margin-top: 1rem;
  max-width: 1100px;
}
.icon{
  cursor: pointer;
}
</style>