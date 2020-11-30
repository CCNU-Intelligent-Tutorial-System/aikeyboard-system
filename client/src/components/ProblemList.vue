<template>
  <div class="plist">
    <aside class="menu">
      <p class="menu-label">
        数理逻辑
      </p>
      <ul class="menu-list" >
        <li v-for="l in logic"><a>{{ l.description }}</a></li>
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
      problems:[],
      logic: []
    }
  },
  created() {
    this.initData();
  },
  methods:{
    async initData() {

      const response = await axios.get('http://discretemath-app.herokuapp.com/problems?_expand=chapter');
      this.problems = response.data.sort((q1,q2)=>(q1.chapterId-q2.chapterId));
      this.logic = this.problems.filter((o)=>(o.chapter.text==="数理逻辑"))
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