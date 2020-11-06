(function(t){function e(e){for(var s,o,a=e[0],c=e[1],l=e[2],p=0,u=[];p<a.length;p++)o=a[p],Object.prototype.hasOwnProperty.call(n,o)&&n[o]&&u.push(n[o][0]),n[o]=0;for(s in c)Object.prototype.hasOwnProperty.call(c,s)&&(t[s]=c[s]);d&&d(e);while(u.length)u.shift()();return r.push.apply(r,l||[]),i()}function i(){for(var t,e=0;e<r.length;e++){for(var i=r[e],s=!0,a=1;a<i.length;a++){var c=i[a];0!==n[c]&&(s=!1)}s&&(r.splice(e--,1),t=o(o.s=i[0]))}return t}var s={},n={app:0},r=[];function o(e){if(s[e])return s[e].exports;var i=s[e]={i:e,l:!1,exports:{}};return t[e].call(i.exports,i,i.exports,o),i.l=!0,i.exports}o.m=t,o.c=s,o.d=function(t,e,i){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},o.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(o.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)o.d(i,s,function(e){return t[e]}.bind(null,s));return i},o.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="/";var a=window["webpackJsonp"]=window["webpackJsonp"]||[],c=a.push.bind(a);a.push=e,a=a.slice();for(var l=0;l<a.length;l++)e(a[l]);var d=c;r.push([0,"chunk-vendors"]),i()})({0:function(t,e,i){t.exports=i("56d7")},"034f":function(t,e,i){"use strict";var s=i("85ec"),n=i.n(s);n.a},"56d7":function(t,e,i){"use strict";i.r(e);var s=i("2b0e"),n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{attrs:{id:"app"}},[i("h1",{staticClass:"subtitle has-text-centered"},[t._v("Problem List")]),i("hr"),i("div",{staticClass:"field has-addons"},[i("div",{staticClass:"control is-expanded"},[i("input",{directives:[{name:"model",rawName:"v-model",value:t.description,expression:"description"}],staticClass:"input",attrs:{type:"text",placeholder:"输入问题"},domProps:{value:t.description},on:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.addItem(e)},input:function(e){e.target.composing||(t.description=e.target.value)}}})]),i("div",{staticClass:"control"},[i("a",{staticClass:"button is-info",attrs:{"aria-disabled":!t.description},on:{click:t.addItem}},[t._v("Add")])])]),t._l(t.problems,(function(e,s){return i("div",{key:e._id,staticClass:"notification"},[i("div",{staticClass:"columns"},[t.isSelected(e)?i("input",{directives:[{name:"model",rawName:"v-model",value:t.editedDescription,expression:"editedDescription"}],staticClass:"column input",attrs:{type:"text"},domProps:{value:t.editedDescription},on:{keyup:function(i){return!i.type.indexOf("key")&&t._k(i.keyCode,"enter",13,i.key,"Enter")?null:t.updateItem(e,s)},input:function(e){e.target.composing||(t.editedDescription=e.target.value)}}}):i("p",{staticClass:"column"},[i("span",{staticClass:"tag is-primary"},[t._v(t._s(s+1))]),t._v(" "+t._s(e.description)+" ")]),i("div",{staticClass:"column is-narrow"},[i("span",{staticClass:"icon has-text-primary",on:{click:function(i){t.isSelected(e)?t.unselect():t.select(e)}}},[i("i",{staticClass:"material-icons"},[t._v(t._s(t.isSelected(e)?"close":"edit"))])]),i("span",{staticClass:"icon has-text-info",on:{click:function(i){t.isSelected(e)?t.updateItem(e,s):t.removeItem(e,s)}}},[i("i",{staticClass:"material-icons"},[t._v(t._s(t.isSelected(e)?"save":"delete"))])])])])])}))],2)},r=[],o=i("bc3a"),a=i.n(o),c={name:"App",data(){return{problems:[],description:"",editedDescription:"",selected:{}}},async mounted(){const t=await a.a.get("^/api/test");this.problems=t.data},methods:{async addItem(){const t=await a.a.post("^/api/test",{description:this.description});this.problems.push(t.data),this.description=""},async removeItem(t,e){console.log(t.id),await a.a.delete("http://localhost:3000/test/"+t.id),this.problems.splice(e,1)},select(t){this.selected=t,this.editedDescription=t.description},isSelected(t){return t.id===this.selected.id},unselect(){this.selected={},this.editedDescription=""},async updateItem(t,e){const i=await a.a.put("http://localhost:3000/test/"+t.id,{description:this.editedDescription});this.problems[e]=i.data,this.unselect()}}},l=c,d=(i("034f"),i("2877")),p=Object(d["a"])(l,n,r,!1,null,null,null),u=p.exports;s["a"].config.productionTip=!1,new s["a"]({render:t=>t(u)}).$mount("#app")},"85ec":function(t,e,i){}});
//# sourceMappingURL=app.16693557.js.map