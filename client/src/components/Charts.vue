<template>
  <div class="main">
    <h1>Charts</h1>
    <h3 v-if="id">{{id}}</h3>
  </div>
</template>

<script>
export default {
  name: "Charts",
  props:[
      'id'
  ]
}
</script>

<style scoped>

</style>