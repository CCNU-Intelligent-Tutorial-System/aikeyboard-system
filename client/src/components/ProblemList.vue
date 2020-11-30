<template>
  <div class="plist">
    <h1>dsds</h1>
    <aside class="menu">
      <p class="menu-label">
        General
      </p>
      <ul class="menu-list">
        <li><a>Dashboard</a></li>
        <li><a>Customers</a></li>
      </ul>
      <p class="menu-label">
        Administration
      </p>
      <ul class="menu-list">
        <li><a>Team Settings</a></li>
        <li>
          <a class="is-active">Manage Your Team</a>
          <ul>
            <li><a>Members</a></li>
            <li><a>Plugins</a></li>
            <li><a>Add a member</a></li>
          </ul>
        </li>
        <li><a>Invitations</a></li>
        <li><a>Cloud Storage Environment Settings</a></li>
        <li><a>Authentication</a></li>
      </ul>
      <p class="menu-label">
        Transactions
      </p>
      <ul class="menu-list">
        <li><a>Payments</a></li>
        <li><a>Transfers</a></li>
        <li><a>Balance</a></li>
      </ul>
    </aside>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ProblemList",
  data(){
    return {
      problems:[]
    }
  },
  created() {
    this.initData();
  },
  methods:{
    async initData() {
      const response = await axios.get('http://discretemath-app.herokuapp.com/problems?_expand=chapter');
      this.problems = response.data.sort((q1,q2)=>(q1.chapterId-q2.chapterId));

    },
  }
}
</script>

<style scoped>
  .plist{
    position: absolute;
    z-index: 9999;
    right: 70px;
    top: 50px;
    background-color: whitesmoke;
  }
</style>