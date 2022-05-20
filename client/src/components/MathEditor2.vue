<template>
  <div id="editor">

    <div class="keyboard">
      <Keyboard />
    </div>

    <div v-if="showPrompt" class="alertify">
      <div id="dlgContent" class="dialog">
        <div>
          <div style="font-weight: 600;display: flex;padding-bottom: 30px;color: black">选择删除：</div>
          <input type="checkbox" v-model="deletedLines" class="ajs-input"
                 v-for="(line,i) in toBeDeletedLines" name="select" :id="'input'+i" :value="line._id" style="display: none">
          <div v-for="(line,i) in toBeDeletedLines"  style="padding: 10px;margin-bottom: 10px;color: black" :class="labelcss(line)">
            <span class="mcheck" v-show="deletedLines.indexOf(line._id)>-1"></span>
            <label  :id="'l'+i" :for="'input'+i" >第{{line.startId+1}}行->第{{line.endId+1}}行</label>
          </div>
        </div>
        <nav>
          <button class="ok" tabindex="1" @click="removeLines()">确定</button>
          <button class="cancel" tabindex="2" @click="showPrompt=false">取消</button>
        </nav>
      </div>
    </div>

    <canvas id="myCanvas"></canvas>
    <div class="board">
      <div id="hint" v-show="show_keyboard" class="hg-row">
        <div v-for="(k,j) in mathKeys" @click="event =>inputMath(event, k)" style="cursor: pointer" >
          {{k }}
        </div>
      </div>

      <div class="title" style="position: relative;z-index:999">答题卡</div>
      <div class="wrapper x" style="position: relative;z-index:999">
        <div class="custom-keys">
          <math-field v-for="k in mathKeys" class="key" @click="event =>inputMath(event, k)" @selection-change="onSelect($event, i)" style="cursor: pointer" >
            {{ k }}
          </math-field>
        </div>
      </div>

      <div class="outline">
        <div class="content">
          <div id="output"></div>
          <div class="datetime is-pulled-right">写作于 {{ cur_time() }}</div>
          <div class="paper">
            <div class="codex-editor">
              <div class="codex-editor__redactor" style="padding-bottom: 100px">
                <div class="ce-block" v-for="(d,i) in data">
                  <div class="ce-block__content" style="position: relative">
                    <i :id="'icon'+i" class="fa fa-link mlink" @click="addline($event, i)" @contextmenu="deleteLine($event, i)" title="链接" aria-hidden="true"></i>
                    <math-field :id="'mathField'+i"
                                :ref="'mathField'+i"
                                @focus="event =>onFocus(event, i)"
                                @input="event => onInput(event, i)"
                                @focus-out="onFocusOut($event, i)"
                                @keyup.delete="onRemove(i)"
                                @keyup.up="onPressUp(i)"
                                @keyup.down="onPressDown(i)"
                                @keyup.enter="event => enter(event,i)"
                                @selection-change="onSelect($event, i)"
                                v-text="translate(d)"
                                class="ce-paragraph cdx-block single-line"
                                contenteditable="true"
                                :placeholder="i==0?'请输入你的答题步骤...':''"
                                :style="translateStyle(d)"
                                virtual-keyboard-mode="manual">
                    </math-field>

                  </div>
                </div>
              </div>
            </div>
            <button class="button is-primary is-pulled-right" @click="save()">保存</button>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>


<script>
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import Warning from '@editorjs/warning';
import Marker from '@editorjs/marker';
import Delimiter from '@editorjs/delimiter';
import Table from '@editorjs/table';
import VueHotkey from 'v-hotkey'
import Vue from 'vue';
import ProblemList from './ProblemList';
import Keyboard from '@/components/Keyboard'
// const io = require('socket.io')();
Vue.use(VueHotkey);




export default {
  name: "MathEditor",
  components: {ProblemList,Keyboard},
  comments:{
    'problem-list':ProblemList,
    'dynamic-keyboard':Keyboard
  },
  data() {
    return {
      userId: '',
      problemId:'',
      data: [],
      show_hint: false,
      show_keyboard: false,
      previouslyFocused: null,
      isFocusing: false,
      isRemoving: false,
      isSelecting: false,
      cur_index: -1,
      mathField: null,
      mathkey: '',
      editor: null,
      mathKeys: [
        '\\in',
        '\\subset',
        '\\gets',
        '\\rightarrow',
        '\\implies',
        '\\leftrightarrow',
        '\\Leftrightarrow',
        '\\forall',
        '\\exists',
        '\\because',
        '\\therefore',
        '\\land',
        '\\lor',
        '\\neg',
        '\\cup',
        '\\aleph',
        '\\mid',
        '\\R',
        '\\Q',
        '\\Z'
      ],


      ctx: null,
      socket: null,

      lines:[],
      toBeDeletedLines:[],
      deletedLines: [],
      now_id:-1,
      first_index:-1,
      mousepos:{x:0,y:0},
      startMousePos:{x:0,y:0},
      status:'',
      first_click:false,
      img_css:'',
      scale: 1,
      time: 0,
      showPrompt: false
    }
  },
  watch:{
    mousepos(){
      if(this.now_id!==-1){
        let now_positit = this.postits[this.now_id];
        this.postits[this.now_id].pos.x = this.mousepos.x-this.startMousePos.x;
        this.postits[this.now_id].pos.y = this.mousepos.y-this.startMousePos.y;
        this.socket.emit('update',this.postits[this.now_id]);
      }
    },
    scale(){
      this.ctx.scale(this.scale,this.scale);
    }
  },
  mounted() {
    var app = this;
    this.userId = 'cxd';
    this.problemId = '1001';
    // var l = '证明：\\n定义一个从A \\times B到正实数的函数f，\\n f: A \\times B \\rightarrow \\{x|x \\in R_+\\} > f(n, x) = n + x\\n因为f是一个入射函数，且K[R_+] = \\aleph\\n所以K[A \\times B] \\leqslant \\aleph\\n此外，作映射g: (0, 1) \\rightarrow A \\times B\\n g(x) = <0, x>\\n因为g是入射的，故\\aleph \\leqslant K[A \\times B]\\n因此K[A \\times B] = \\aleph'.split('\\n')
    var l = '设A = N，B=(0,1)，K[A] = \\aleph_0，K[B] = \\aleph，求证：K[A \\times B] = \\aleph \\n 证明：\\n定义一个从A \\times B到正实数的函数f，\\n f: A \\times B \\rightarrow \\{x|x \\in R_+\\} > f(n, x) = n + x\\n因为f是一个入射函数，且K[R_+] = \\aleph\\n所以K[A \\times B] \\leqslant \\aleph\\n此外，作映射g: (0, 1) \\rightarrow A \\times B\\n g(x) = <0, x>\\n因为g是入射的，故\\aleph \\leqslant K[A \\times B]\\n因此K[A \\times B] = \\aleph'.split('\\n')
    for (var d in l) {
      this.data.push(l[d]);
    }

    String.prototype.splice = function (idx, rem, str) {
      return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
    };

    //ming map
    var B = Bliss, BB = Bliss.$;

    BB("ul.tree").forEach(ul => {
      BB("li", ul).forEach(li => {
        if (li.childNodes[0].nodeType == 3) {
          B.create("span", {
            around: li.childNodes[0]
          });
        }
      });
      BB("li li > span", ul).forEach(span => {
        var li = span.closest("ul").parentNode;
        var lineCS = getComputedStyle(span, "::before");
        var top = span.parentNode.offsetTop + span.parentNode.offsetHeight / 2;
        var parentTop = li.offsetHeight / 2;
        var dy = top - parentTop;
        var dx = parseInt(lineCS.width);
        var angle = Math.atan2(dy, dx);
        var θ = angle * 180 / Math.PI;
        span.style.setProperty("--angle", θ);
        span.style.setProperty("--cos-angle", Math.abs(Math.cos(angle)));
      });
    });

    // canvas
    this.socket = io.connect('http://127.0.0.1:5200', {transports: ['websocket', 'polling', 'flashsocket']});
    Vue.nextTick( ()=>{
      this.socket.emit('addpostits', {
        userId: this.userId,
        problemId: this.problemId,
        data: this.postits
      });
    });

    (function () {
      app.socket.on("output", data => {
        console.log("便利贴个数：",data.length);
        if (data.length) {
          app.postits=data;
        }else {
          app.postits = [];
        }
      });
      app.socket.on("lines", data => {
        console.log("拓扑图线条个数：",data.length);
        if (data.length) {
          app.lines=data;
          app.lines.forEach(line=>{


            let startId = line.startId;
            let endId = line.endId;
            let d = endId - startId;
            let dd = d * 2;
            let child = document.getElementById('icon'+endId);
            let span = B.create("span", {
              around: child
            });
            child.style.setProperty("--dy", dd+"rem");
          });
        }else {
          app.lines = [];
        }
      });
      app.socket.on("status", data => {
        alertify.reset();
        if(typeof data==='object') {
          switch (data.type){
            case 'error':
              alertify.error(data.message);
              break;
            case 'success':
              alertify.success(data.message);
          }
        }else{
          alertify.success(data);
        }
        // app.status = ((typeof data==='object')?data.message:data);
      });
      app.socket.on("searchResult",data=>{
        if (data.length>0){
          alertify.success(data.length>0?data[0]._fields[0].properties.explanation:'');
        }

      })
    })();

    var c=$("#myCanvas")[0];
    this.ctx = c.getContext("2d");

    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
      if (w < 2 * r) r = w / 2;
      if (h < 2 * r) r = h / 2;
      this.beginPath();
      this.moveTo(x+r, y);
      this.arcTo(x+w, y,   x+w, y+h, r);
      this.arcTo(x+w, y+h, x,   y+h, r);
      this.arcTo(x,   y+h, x,   y,   r);
      this.arcTo(x,   y,   x+w, y,   r);
      this.closePath();
      return this;
    }

    var ww,wh;
    var center = {x:0,y:0};
    function getWindowSize(){
      ww = $(window).outerWidth();
      wh = $(window).outerHeight();
      c.width = ww;
      c.height = wh;
      center={x:ww/2,y:wh/2};
      app.ctx.restore();
      // app.ctx.globalCompositeOperation = 'copy';
      app.ctx.translate(0,0);
      app.ctx.fillStyle = "white";
      // app.ctx.fillStyle='#00E0A8';
      app.ctx.fillRect(0, 0, c.width, c.height);
    }
    getWindowSize();
    $(window).resize(getWindowSize);



    setInterval(this.draw,10);
    this.time = 0;

    window.onmousemove = (event)=>{
      this.mousepos = {x: event.clientX+document.body.scrollLeft,y: event.clientY+document.body.scrollTop}
    };

    window.onmouseup = (evt)=>{
      this.now_id = -1
    };
    window.ondblclick = (evt)=>{
      if(this.first_click) {
        this.first_click = false;

      }
    };
    window.oncontextmenu = (evt)=>{
      evt.preventDefault();
      if (app.first_click){
        app.first_click = false;
      }
    };



  },
  updated() {
    var app = this;
      if (app.$refs['mathField' + app.cur_index]){
        app.$refs['mathField' + app.cur_index][0].focus();
      }
  },
  methods: {

    onFocus(e, index) {
      console.log('onFocus');
      this.isFocusing = true;
      this.cur_index = index;
      this.previouslyFocused = e.target
    },
    onInput(event, index) {
      console.log('onInput');
      event.preventDefault();
      let value = event.target.value;
      value = value.replaceAll('$$', '');
      this.$set(this.data, index, value);
    },
    onRemove(index) {
      if (this.data.length > 1 && this.data[index].length === 0) {
        let tempArray = [];
        tempArray = this.data;
        this.data.splice(index, 1);
        this.cur_index -= 1;
        this.isRemoving = true;
        this.isFocusing = true;
      }
    },
    onPressUp(i) {
      if (this.cur_index > 0) {
        this.cur_index = this.cur_index - 1;
        this.$forceUpdate();
      }
    },
    onPressDown(i) {
      if (this.cur_index < this.data.length - 1) {
        this.cur_index = this.cur_index + 1;
        this.$forceUpdate();
      }
    },
    onPressTab(e, i){
      var t = e.target;
      let left = t.offsetLeft;
      let top = t.offsetTop;
      var hint = document.getElementById("hint");
      hint.style.left=left+'px';
      hint.style.top=top+'px';
      this.onPressUp(i);
      this.show_keyboard = !this.show_keyboard;

    },
    onFocusOut(event, i){
      console.log(event.detail.direction);
    },
    onSelect(event,i){
      console.log('onSelect');
      console.log(event);
        var target = event.target;
        var selection = window.getSelection().toString();
        console.log(window.getSelection())
        console.log(selection);
        console.log(this.selectionStart);
        if (selection==="" && this.mathkey!=''){
          let k = this.mathkey;
          this.mathkey = '';
          let pos = target.position;
          console.log('pos:'+pos);
          target.insert(k);
          document.execCommand('paste');
        }else{
          this.socket.emit('search',selection);
          target.applyStyle({ backgroundColor: 'yellow' },selection,{
            suppressChangeNotifications: true,
          });
          document.execCommand('paste');
        }

    },
    enter(event, index) {
      event.preventDefault();
      let value = event.target.value;
      value = value.replaceAll('$$', '');
      this.$set(this.data, index, value);
      this.isRemoving = false;
      this.cur_index += 1;
      this.data.splice(this.cur_index, 0, '');
    },
    save() {
      this.socket.emit('addpostits', {
        userId: this.userId,
        problemId: this.problemId,
        data: this.postits
      });
    },
    cur_time() {
      let currentdate = new Date();
      return currentdate.getDate() + "/"
          + (currentdate.getMonth() + 1) + "/"
          + currentdate.getFullYear() + "  " +
          currentdate.getHours() + ":" + currentdate.getMinutes();
    },
    inputMath(e, key) {
      e.target.mode = "text";
      this.mathkey = key;
    },
    translate(d, i) {
      return '$$' + d;
    },
    translateStyle(d) {
      let s = 'font-family: Avenir;white-space: nowrap;margin-bottom: 5px;'
      if (d.toString().indexOf('所以')>-1 || d.toString().indexOf('故')>-1|| d.toString().indexOf('因此')>-1){
        return s+'box-shadow:inset 0px 0px 3px 1px #00e0a8'
      }else {
        return s;
      }
    },
    getCaretPosition(editableDiv) {
      var caretPos = 0,
          sel, range;
      if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
          range = sel.getRangeAt(0);
          if (range.commonAncestorContainer.parentNode == editableDiv) {
            caretPos = range.endOffset;
          }
        }
      } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        if (range.parentElement() == editableDiv) {
          var tempEl = document.createElement("span");
          editableDiv.insertBefore(tempEl, editableDiv.firstChild);
          var tempRange = range.duplicate();
          tempRange.moveToElementText(tempEl);
          tempRange.setEndPoint("EndToEnd", range);
          caretPos = tempRange.text.length;
        }
      }
      return caretPos;
    },


    //canvas
    posCss(p) {
      return {
        left: p.pos.x+"px",
        top: p.pos.y+"px",
        fontSize: ((240)/p.text.length-5)+"px"
      }
    },
    addline(evt, index){
      var app = this;
      this.lines.forEach((line, i) => {

        var start_p = app.postits.filter((o) => (o.dataId === line.startId))[0];
        var end_p = app.postits.filter((o) => (o.dataId === line.endId))[0];
        let color = '#00E0A8';
        app.ctx.fillStyle=color;
        app.ctx.strokeStyle = color;
        let radius = 5;
        app.ctx.fillRect(start_p.pos.x-radius/2, start_p.pos.y-radius/2,radius,radius);
        app.ctx.fillRect(end_p.pos.x-radius/2, end_p.pos.y-radius/2,radius,radius);

        app.ctx.moveTo(start_p.pos.x, start_p.pos.y);
        let xOffset = 17, yOffset = 39;
        let diff = line.endId - line.startId;
        xOffset = xOffset * diff;
        app.ctx.bezierCurveTo(start_p.pos.x-xOffset, start_p.pos.y, end_p.pos.x-xOffset, end_p.pos.y,
            end_p.pos.x, end_p.pos.y);
      });
      if (!this.first_click){
        this.first_click = true;
        this.first_index = index;
      }else{
        if(this.first_index!==index) {
          this.first_click = false;
          this.socket.emit('addline',
              {   startId:this.postits[this.first_index].dataId,
                endId:this.postits[index].dataId,
                color: "#a400e0",
                userId: this.userId,
                problemId:this.problemId
              });
          // $('#img'+index)[0].removeAttribute('style');
        }else {
          this.now_id = index;
          this.startMousePos = {
            x: evt.offsetX,
            y: evt.offsetY,
          }
        }
      }
    },
    removeLines(){
      this.lines  = this.lines.filter((l)=>(this.deletedLines.indexOf(l._id)===-1));
      this.socket.emit('deletelines',this.deletedLines);
      this.showPrompt = false;
    },
    changeStyle(evt,pid){
      if(this.first_click&&this.first_index!==pid) {
        $('#img'+pid)[0].setAttribute('style','box-shadow: 0px 0px 10px lightblue;');
      }
    },
    restoreStyle(evt,pid){
      if(this.first_click&&this.first_index!==pid) {
        $('#img'+pid)[0].removeAttribute('style');
      }
    },
    selectId(evt,pid){
      if(!evt.srcElement.classList.contains('img')){
        if(this.first_click&&this.first_index!==pid) {
          this.first_click = false;
          this.socket.emit('addline',
              {   startId:this.postits[this.first_index].dataId,
                endId:this.postits[pid].dataId
              });
          $('#img'+pid)[0].removeAttribute('style');
        }else {
          this.now_id = pid;
          this.startMousePos = {
            x: evt.offsetX,
            y: evt.offsetY,
          }
        }
      }else{
        this.now_id = -1;
      }
    },
    addPostit(){
      this.socket.emit('addpostit',{text:"路由"+(Math.random()*1000+1000).toFixed(0),src:"router.jpg",status:1,pos:{x:300+Math.random()*300,y:150+Math.random()*150}});
    },
    setText(index){
      alertify
          .okBtn('确认')
          .cancelBtn('取消')
          .defaultValue(this.postits[index].text)
          .prompt("请输入新的文字",(text,evt)=>{
            evt.preventDefault();
            if(text){
              var pat=new RegExp("[^a-zA-Z0-9\_\u4e00-\u9fa5]","i");
              if(pat.test(text))
              {
                alertify.error('含有非法字符，如：，。');
              }
              else if(text.length>20) {
                text = text.slice(0,20);
                alertify.error('长度超过20。');
              }else {
                this.postits[index].text = text;
                this.socket.emit('update',this.postits[index])
              }
            }
          },function (evt) {
            evt.preventDefault();
          });
      // let text = prompt("请输入新的文字",this.postits[index].text);

    },
    deleteLine(evt, index){
      // var postit = this.postits[index];
      // this.lines = this.lines.filter((o) =>
      //     (o.startId !== postit.dataId && o.startId !== postit.dataId));

      // this.socket.emit('deletelines',postit);
      this.toBeDeletedLines = this.lines.filter((o)=>
          (o.startId===index||o.endId===index));
      this.$forceUpdate();
      Vue.nextTick(()=>{
        this.showPrompt = true;
      });
      // alertify.prompt('sss');

    },
    deleteAll(){
      alertify
          .okBtn('确认')
          .cancelBtn('取消')
          .confirm('删除所有设备吗？',()=>{
            this.socket.emit('deleteAll');
          },()=>{
            alertify.error('您取消了操作。');
          });
    },

    draw(){
      var app = this;
      this.time+=1;
      app.ctx.fillStyle='white';
      this.ctx.fillRect(0, 0, window.outerWidth,window.outerHeight);

      this.ctx.beginPath();
      app.ctx.fillStyle = "#eef5fa";
      app.ctx.roundRect(75, 10, 950, 900, 100).fill();
      app.ctx.fillStyle = "white";
      app.ctx.roundRect(125, 140, 850, 700, 8).fill();
      app.ctx.restore();

      this.ctx.beginPath();
      this.ctx.lineWidth = "5";
      if (this.lines.length) {
        this.lines.forEach((line, i) => {

          var start_p = app.postits.filter((o) => (o.dataId === line.startId))[0];
          var end_p = app.postits.filter((o) => (o.dataId === line.endId))[0];
          let color = '#00E0A8';
          app.ctx.fillStyle=color;
          app.ctx.strokeStyle = color;
          let radius = 5;
          app.ctx.fillRect(start_p.pos.x-radius/2, start_p.pos.y-radius/2,radius,radius);
          app.ctx.fillRect(end_p.pos.x-radius/2, end_p.pos.y-radius/2,radius,radius);

          app.ctx.moveTo(start_p.pos.x, start_p.pos.y);
          let xOffset = 17, yOffset = 39;
          let diff = line.endId - line.startId;
          xOffset = xOffset * diff;
          app.ctx.bezierCurveTo(start_p.pos.x-xOffset, start_p.pos.y, end_p.pos.x-xOffset, end_p.pos.y,
              end_p.pos.x, end_p.pos.y);
        });
      }
      this.ctx.stroke();
      if(this.first_click) {

        this.ctx.beginPath();
        this.ctx.strokeStyle = "#00E0A8";
        this.ctx.lineWidth = "5";
        this.ctx.moveTo(this.postits[this.first_index].pos.x, this.postits[this.first_index].pos.y);
        this.ctx.lineTo(this.mousepos.x, this.mousepos.y);
        this.ctx.stroke();
      }

      app.ctx.restore();
    },
    labelcss(line){
      return this.deletedLines.indexOf(line._id)>-1?'active':'option';
    }


  },
  computed: {
    postits: {
      get(){
        return this.data.map((d,index)=>{
          let e = document.getElementById('icon'+index);
          return {
            dataId: index,
            content: d,
            pos:{
              x: e.getBoundingClientRect().x + window.scrollX + e.offsetWidth/2,
              y: e.getBoundingClientRect().y + window.scrollY + e.offsetHeight/2
            }
          }
        });
      },
      set(value){

      }
    },

  }
}
</script>

<style scoped>
.board {
  background: #eef5fa;
  border-radius: 100px;
  max-width: 950px;
  margin: 0 auto;
  padding: 10px 60px;
}

.title {
  justify-content: center;
  align-items: center;
  display: flex;
  padding-top: 20px;
}

.outline {
  padding-bottom: 50px;
  padding-top: 20px;
}

.content {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 24px 24px -18px rgba(69, 104, 129, .33), 0 9px 45px 0 rgba(114, 119, 160, .12);
  padding: 20px 50px;
  font-size: 16px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.paper {
  padding: 40px 0;
}

.datetime {
  font-style: italic;
  font-size: 12px;
  margin-bottom: 20px;
  letter-spacing: .1em;
}
.keyboard {
  position: absolute;
  z-index: 9999;
  right: 70px;
  top: 50px;
}
</style>