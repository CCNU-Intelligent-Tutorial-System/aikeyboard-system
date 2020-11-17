<template>
  <div class="main">
    <h1>Charts</h1><i class="material-icons icon">settings</i>
    <input class="slider is-fullwidth" step="10" min="0" max="500"  type="range" v-model="slider">
    <h3 v-if="id">{{id}}</h3>
    <div  class="container" style="margin-top: 10px">
      <table id="p_table" class="table" style="width:100%">
        <thead>
          <tr>
            <th v-for="row in rows" style="white-space: nowrap;">{{row}}</th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th v-for="row in rows" style="white-space: nowrap;">{{row}}</th>
          </tr>
        </tfoot>
        <tbody>
          <tr v-for="(p,i) in problems">
            <td><span class="tag is-primary" :style="'background-color:'+icon_color(Math.floor(Math.random()*100))">{{i+1}}</span></td>
            <td><math-field contenteditable="false">{{ p.description+p.question }}</math-field></td>
            <td>{{ p.concepts?p.concepts.join(','):'' }}</td>
            <td>{{ Math.floor(Math.random()*100) }}%</td>
            <td>Teacher Yu</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Charts",
  props:[
      'id'
  ],
  data(){
    return {
      slider: 100,
      total_num : 20,
      percentColors: [
        { pct: 0.0, color: { r: 0, g: 209, b: 178 } },
        { pct: 0.5, color: { r: 170, g: 220, b: 206 } },
        { pct: 1.0, color: { r: 241,  g: 70, b: 104 } } ],
      rows:[
        "NO.",
        "问题",
        "关键词",
        "通过率",
        "创建者"
      ],
      problems:[]
    }
  },
  watch:{
    slider: function (val){
      this.changeTableMaxWidth(val);
    }
  },
  created() {
    this.initData();

  },
  mounted(){

  },
  beforeUpdate() {

  },
  updated(){
    $('#p_table').DataTable({
      paging: true,
      pagingType: 'full_numbers',
      ordering: true,
      info: true,
      stateSave: true,
      bDestroy: true
    });
  },
  computed:{
  },
  methods:{
    async initData() {
      const response = await axios.get('^/api/problems');
      this.problems = response.data;

    },
    changeTableMaxWidth(width){
      var val = parseInt(width)+1000;
      $('#dashboard').css('max-width',(val)+'px');
    },
    icon_color(pct) {
      pct = pct / 100
      let percentColors = this.percentColors
      for (var i = 1; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
          break;
        }
      }
      var lower = percentColors[i - 1];
      var upper = percentColors[i];
      var range = upper.pct - lower.pct;
      var rangePct = (pct - lower.pct) / range;
      var pctLower = 1 - rangePct;
      var pctUpper = rangePct;
      var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
      };
      return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
      // or output as hex if preferred
    },

  }
}


</script>

<style scoped>
.slider {
  position: absolute;
  top: 53px;
  left: 50%;
}
</style>