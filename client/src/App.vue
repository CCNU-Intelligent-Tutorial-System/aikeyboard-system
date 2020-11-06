<template>
  <div id="app">

    <template>
      <sidebar-menu :menu="menu" />
    </template>

    <router-view/>

  </div>
</template>

<script>
import { SidebarMenu } from 'vue-sidebar-menu';
import Home from '@/components/Home'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css';

export default {
  name: 'App',
  components: {
    SidebarMenu,
    Home
  },
  data(){
    return {
      menu: [
        {
          header: true,
          title: 'Main Navigation',
          hiddenOnCollapse: true
        },
        {
          href: '/',
          title: 'Dashboard',
          icon: 'fa fa-user'
        },
        {
          href: '/charts',
          title: 'Charts',
          icon: 'fa fa-chart-area',
          child: [
            {
              href: '/charts/1',
              title: 'Sub Link 1'
            }
          ]
        }
      ]
    }
  },

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: auto;
  margin-top: 3rem;
  max-width: 700px;
}
.icon{
  cursor: pointer;
}

</style>
