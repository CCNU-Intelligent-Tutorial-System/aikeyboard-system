<template>
<div class="container">
  <div class="layout shadow">
    <div class="banner">
      <div class="banner_left">
        <div class="title1">第四题</div>
      </div>
      <div class="banner_right">
        <div class="btn_collapse"></div>
      </div>
    </div>
    <div class="Layer">
      <div class="banner">
        <div class="banner_left"><br>&nbsp;</div>
      </div>
      <input id="chck1" type="checkbox"/>
      <label class="banner_right btn_unfold" for="chck1">展开</label>
      <div class="symbols mh55">
        <div class="symbol_ shadow" v-for="s in l1_data" @click="copy(s)"> 
          <div class="s1">{{ s }}</div>
          <div class="t1">{{ meaning(s) }}</div>
        </div>
      </div>
    </div>
    <div class="Layer">
      <div class="banner">
        <div class="banner_left">
          <div class="kp" v-for="kp in kps">{{ kp }}</div>
        </div>
      </div>
      <input id="chck2" type="checkbox"/>
      <label class="banner_right btn_unfold" for="chck2">展开</label>
      <div class="symbols mh35">
        <div class="symbol shadow" v-for="s in l2_data" @click="copy(s)">{{ s }}</div>
      </div>
    </div>
    <div class="Layer">
      <div class="banner">
        <div class="banner_left">
          <div class="title2">{{ subject }}</div>
        </div>
      </div>
      <input id="chck3" type="checkbox"/>
      <label class="banner_right btn_unfold" for="chck3">展开</label>
      <div class="symbols mh35">
        <div class="symbol shadow" v-for="s in l3_data" @click="copy(s)">{{ s }}</div>
      </div>
    </div>
    <div class="Layer">
      <div class="banner">
        <div class="banner_left">
          <div class="title2">其他</div>
        </div>
      </div>
      <input id="chck4" type="checkbox"/>
      <label class="banner_right btn_unfold" for="chck4">展开</label>
      <div class="symbols mh70">
        <div class="symbol shadow" v-for="s in l4_data" @click="copy(s)">{{ s }}</div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from "axios";

export default {
  name: "ProblemList",
  data(){
    return {
      subject: '离散数学',
    kps: ['证明','集合','推理'],
    l1_data:['⇔','∈','∩','~','ℚ','ℝ','○','א','ℤ','φ','≡','ℚ','ℝ','○','א','ℤ','φ','≡'],
    l2_data:['∧','∨','┐','∀','∪','⊃','∃','ℚ','ℝ','○','א','ℤ','φ','≡','ℚ','ℝ','○','א','ℤ','φ','≡'],
    l3_data:['ℚ','ℝ','○','א','ℤ','φ','≡','∧','∨','┐','∀','∪','⊃','∃','ℚ','ℝ','○','א','ℤ','φ','≡','ℚ','ℝ','○','א','ℤ','φ','≡','ℚ','ℝ','○','א','ℤ','φ','≡','ℚ','ℝ','○','א','ℤ','φ','≡'],
    l4_data:['α','β','ε','δ','≈','∝','≅','π','∞','⊻','⊕','Θ','△','◇','ℚ','ℝ','○','א','ℤ','φ','≡','ℚ','ℝ','○','א','ℤ','φ','≡']
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
    meaning(symbol){
      if(symbol=='⇔')
        return '实质等价';
      if(symbol=='∈')
        return '元素属于';
      if(symbol=='∩')
        return '交集';
      if(symbol=='~')
        return '非';
      else
        return '';
    },
    copy(symbol){
      var textareaC = document.createElement('textarea');
      textareaC.setAttribute('readonly', 'readonly'); 
      textareaC.setAttribute('opacity', 0); 
      textareaC.value = symbol;
      document.body.appendChild(textareaC); 
      textareaC.select();
      document.execCommand('copy');
      document.body.removeChild(textareaC);
    }
  }
}
</script>

<style src="../../public/css/keyboard.css">