<template>
  <div id="editor">
    <div class="board">
      <div class="title">答题卡</div>
      <div class="wrapper x">
        <div class="custom-keys">
          <div v-for="k in mathKeys" class="key" @click="event =>inputMath(event, k)">{{ k }}</div>
        </div>
      </div>
      <!--      <span id="math-field" contenteditable="true">vvfdfd</span>-->

      <div class="outline">
        <div class="content">
          <div id="output"></div>
          <div class="datetime is-pulled-right">写作于 {{ cur_time() }}</div>
          <div class="paper">
            <div class="codex-editor">
              <div class="codex-editor__redactor" style="padding-bottom: 300px">
                <div class="ce-block" v-for="(d,i) in data">
                  <div class="ce-block__content">
                    <math-field :id="'mathField'+i"
                                :ref="'mathField'+i"
                                @focus="event =>onFocus(event, i)"
                                @input="event => onInput(event, i)"
                                @keyup.delete="onRemove(i)"
                                @keyup.enter="event => enter(event,i)"
                                v-text="translate(d)"
                                class="ce-paragraph cdx-block single-line"
                                contenteditable="true"
                                :placeholder="i==0?'请输入你的答题步骤...':''"
                                style="font-family: Avenir;white-space: nowrap;"
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
import Vue from 'vue';


export default {
  name: "MathEditor",
  data() {
    return {
      data: [],
      previouslyFocused: null,
      isFocusing: false,
      isRemoving: false,
      cur_index: -1,
      mathField: null,
      editor: null,
      mathKeys: [
        '∊',
        '→',
        '∫',
        '∑',
        '\\sqrt',
        '\\sin',
        '\\cos',
        '\\tan',
        '/',
        '∘',
        '⇒',
        '∮',
        '∀',
        '∃',
        '∅',
        '∩',
        '∪',
        '≤',
        '≥',
        '⊂'
      ]
    }
  },
  mounted() {

    this.data.push('f(x)=mx+1');
    String.prototype.splice = function (idx, rem, str) {
      return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
    };




    // this.editor = new EditorJS({
    //   autofocus: true,
    //   holder: 'editorjs',
    //   data: {
    //     time: 1552744582955,
    //     blocks: [
    //       {
    //         type: "image",
    //         data: {
    //           url: "https://cdn.pixabay.com/photo/2017/09/01/21/53/blue-2705642_1280.jpg",
    //           caption: 'Here is a caption field',
    //           withBorder: false,
    //           withBackground: true,
    //           stretched: false
    //         }
    //       }
    //     ],
    //     version: "2.11.10"
    //   },
    //   tools: {
    //     math: {
    //       class: MathEx,
    //       inLineToolbar: true
    //     },
    //     header: {
    //       class: Header,
    //       inLineToolbar: true
    //     },
    //     list: {
    //       class: List,
    //       inlineToolbar: [
    //         'link',
    //         'bold'
    //       ]
    //     },
    //     embed: {
    //       class: Embed,
    //       inlineToolbar: false,
    //       config: {
    //         services: {
    //           youtube: true,
    //           coub: true
    //         }
    //       }
    //     },
    //     warning: Warning,
    //     marker: MarkerTool,
    //     delimiter: Delimiter,
    //     table: Table,
    //     image: {
    //       class: SimpleImage,
    //       // inLineToolbar: true,
    //       config: {
    //         placeholder: 'Please input Caption...'
    //       }
    //     },
    //   },
    //   i18n: {
    //     messages: {
    //       ui: {
    //         "blockTunes": {
    //           "toggler": {
    //             "Click to tune": "点击修改",
    //             "or drag to move": "或者拖拽移动"
    //           },
    //         },
    //         "inlineToolbar": {
    //           "converter": {
    //             "Convert to": "转化成"
    //           }
    //         },
    //         "toolbar": {
    //           "toolbox": {
    //             "Add": "添加"
    //           }
    //         }
    //       },
    //
    //       toolNames: {
    //         "Text": "文字",
    //         "Heading": "标题",
    //         "List": "列表",
    //         "Warning": "提醒",
    //         "Checklist": "多选框",
    //         "Quote": "引用",
    //         "Code": "代码",
    //         "Delimiter": "分隔符",
    //         "Raw HTML": "HTML代码",
    //         "Table": "表格",
    //         "Link": "链接",
    //         "Marker": "标记",
    //         "Bold": "粗体",
    //         "Italic": "斜体",
    //         "InlineCode": "行内代码",
    //         "Image": "图片",
    //         "MarkerTool":"批改笔",
    //         "MathEx":"数学编辑器"
    //       },
    //
    //       tools: {
    //         "warning": { // <-- 'Warning' tool will accept this dictionary section
    //           "Title": "标题",
    //           "Message": "信息",
    //         },
    //         "link": {
    //           "Add a link": "添加链接"
    //         },
    //         "stub": {
    //           'The block can not be displayed correctly.': '这行显示不正确'
    //         },
    //         "image": {
    //           "Paste an image URL...": "请输入图片地址...",
    //           'Please input Caption...': "请输入图片标题...",
    //           "Caption...":"标题...",
    //           'withBorder': '加边框',
    //           'stretched': '放大',
    //           'withBackground':'加背景',
    //         }
    //       },
    //
    //       /**
    //        * Section allows to translate Block Tunes
    //        */
    //       blockTunes: {
    //         /**
    //          * Each subsection is the i18n dictionary that will be passed to the corresponded Block Tune plugin
    //          * The name of a plugin should be equal the name you specify in the 'tunes' section for that plugin
    //          *
    //          * Also, there are few internal block tunes: "delete", "moveUp" and "moveDown"
    //          */
    //         "delete": {
    //           "Delete": "删除"
    //         },
    //         "moveUp": {
    //           "Move up": "往上移"
    //         },
    //         "moveDown": {
    //           "Move down": "往下移"
    //         },
    //         "withBorder":{
    //           "withBorder":"边框"
    //         }
    //       },
    //     }
    //   }
    // });
  },
  updated() {
    // var app = this;
    // if(this.isFocusing){
    //   // const math = document.getElementById('mathField'+n);
    //   // math.focus();
    //   if (this.isRemoving){
    //     Vue.nextTick(function (){
    //       app.$refs['mathField'+app.cur_index][0].focus();
    //     })
    //   }else{
    //     app.$refs['mathField'+app.cur_index][0].focus();
    //
    //   }
    //
    // }
    // this.isRemoving = false;
  },
  methods: {
    onFocus(e, index) {
      this.isFocusing = true;
      this.cur_index = index;
      this.previouslyFocused = e.target
    },
    onInput(event, index) {
      let value = event.target.value;
      value.replace(/(\n\n?)\n+/g, '$1')
      // let tempArray = [];
      // tempArray = this.data;
      // tempArray[index]  = value;
      // this.data = tempArray;

      this.$set(this.data, index, value);
      console.log(this.data[index]);
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
    enter(event, index) {
      event.preventDefault();
      this.isRemoving = false;
      this.cur_index += 1;
      this.data.splice(this.cur_index, 0, '');
    },
    save() {
      // this.editor.save().then((outputData) => {
      //
      //   const output = document.getElementById('output');
      //   output.innerHTML = JSON.stringify(outputData, null, 4);
      // }).catch((error) => {
      //   console.error('Saving Failed: ', error);
      // })
    },
    cur_time() {
      let currentdate = new Date();
      return currentdate.getDate() + "/"
          + (currentdate.getMonth() + 1) + "/"
          + currentdate.getFullYear() + "  " +
          currentdate.getHours() + ":" + currentdate.getMinutes();
    },
    inputMath(e, str) {

      let index = this.cur_index;
      let tempArray = [];
      let cur_line = this.data[index];
      let cursor = 0;

      let c = this.getCaretPosition(e.target);

      if (window.getSelection) {
        cursor = window.getSelection().anchorOffset;
      }
      cur_line = cur_line.splice(cursor, 0, str);
      // tempArray = this.data;
      // tempArray[index]  = cur_line;
      // this.data = tempArray;

      this.$set(this.data, index, cur_line);
      console.log(this.data[index]);
    },
    translate(d, i) {
      return d;
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
    }

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
</style>