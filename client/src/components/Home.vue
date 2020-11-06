<template>
  <div class="main">
    <h1 class="subtitle has-text-centered">Problem List</h1>
    <hr>
    <div class="field has-addons">
      <div class="control is-expanded">
        <input type="text" v-model="description" class="input" placeholder="输入问题" @keyup.enter="addItem"/>
      </div>
      <div class="control">
        <a class="button is-info" @click="addItem" :aria-disabled="!description">Add</a>
      </div>
    </div>

    <div class="notification" v-for="(problem,i) in problems" :key="problem._id">
      <div class="columns">
        <input type="text" class="column input" v-if="isSelected(problem)" v-model="editedDescription" @keyup.enter="updateItem(problem,i)"/>
        <p class="column" v-else>
          <span class="tag is-primary">{{i+1}}</span>
          {{problem.description}}
        </p>
        <div class="column is-narrow">
          <span class="icon has-text-primary" @click="isSelected(problem)?unselect():select(problem)">
            <i class="material-icons">{{isSelected(problem)?'close':'edit'}}</i>
          </span>
          <span class="icon has-text-info" @click="isSelected(problem)?updateItem(problem,i):removeItem(problem,i)">
            <i class="material-icons">{{isSelected(problem)?'save':'delete'}}</i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: 'Home',
  data(){
    return {
      problems:[],
      description:"",
      editedDescription:"",
      selected:{},
    }
  },
  async mounted(){
    const response = await axios.get('^/api/test');
    this.problems = response.data;
  },
  methods:{
    async addItem(){
      const response = await axios.post('^/api/test',{
        description: this.description,
      });
      this.problems.push(response.data);
      this.description = '';
    },
    async removeItem(problem,i){
      console.log(problem.id);
      await axios.delete('http://localhost:3000/test/'+problem.id);
      this.problems.splice(i,1);
    },
    select(problem){
      this.selected = problem;
      this.editedDescription = problem.description;
    },
    isSelected(problem){
      return problem.id===this.selected.id;
    },
    unselect(){
      this.selected  ={};
      this.editedDescription = '';
    },
    async updateItem(problem,i){
      const response = await axios.put('http://localhost:3000/test/'+problem.id,{
        description: this.editedDescription
      });
      this.problems[i] = response.data;
      this.unselect();
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