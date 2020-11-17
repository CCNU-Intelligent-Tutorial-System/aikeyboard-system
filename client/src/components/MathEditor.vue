<template>
  <div id="editor">
    <div class="board">
      <div class="title">答题卡</div>
      <div class="wrapper x">
        <div class="custom-keys">
          <div v-for="k in mathKeys" class="key" @click="input(k)">{{ k }}</div>
        </div>
      </div>
<!--      <span id="math-field" contenteditable="true">vvfdfd</span>-->
      <div id="keyboard">
        <div class="btn-group" role="group" aria-label="math functions">
          <button type="button" class="btn btn-default" @click='input("\\sqrt")'>√</button>
          <button type="button" class="btn btn-default" @click='input("\\sin")'>sin</button>
          <button type="button" class="btn btn-default" @click='input("\\cos")'>cos</button>
          <button type="button" class="btn btn-default" @click='input("\\tan")'>tan</button>
          <button type="button" class="btn btn-default" @click='input("/")'>/</button>
          <button type="button" class="btn btn-default" @click='input("\Pi")'>Pi</button>
          <button type="button" class="btn btn-default" @click='input("\dagger")'>Dagger</button>
        </div>
      </div>

      <div class="outline">
        <div class="content">
          <div id="output"></div>
          <div class="datetime is-pulled-right">写作于 {{ cur_time() }}</div>
          <div class="paper">
            <div id="editorjs"></div>
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


export default {
  name: "MathEditor",
  data() {
    return {
      mathField: null,
      editor: null,
      mathKeys: [
        '∊' ,
        '→' ,
        '∫' ,
        '∑' ,
          '√',
          'sin',
          'cos',
          'tan',
          '/',
        '∘' ,
        '⇒' ,
        '∮' ,
        '∀' ,
        '∃' ,
        '∅' ,
        '∩' ,
        '∪' ,
        '≤' ,
        '≥' ,
        '⊂' ,
        '⊥'
      ]
    }
  },
  mounted() {
    // let mathFieldSpan = document.getElementById('math-field');
    // let mathFieldSpan = document.querySelector(".ce-block--focused").querySelector('[contenteditable]');
    // let MQ = MathQuill.getInterface(2);
    // this.mathField = MQ.MathField(mathFieldSpan, {
    //   spaceBehavesLikeTab: true,
    //   handlers: {
    //     edit: function() {
    //       this.mathField.focus();
    //     }
    //   }
    // });
    // this.mathField.handlers = {
    //   edit: function () {
    //     this.mathField.focus();
    //   }
    // }

    this.editor = new EditorJS({
      autofocus: true,
      holder: 'editorjs',
      data: {
        time: 1552744582955,
        blocks: [
          {
            type: "image",
            data: {
              url: "https://cdn.pixabay.com/photo/2017/09/01/21/53/blue-2705642_1280.jpg",
              caption: 'Here is a caption field',
              withBorder: false,
              withBackground: true,
              stretched: false
            }
          }
        ],
        version: "2.11.10"
      },
      tools: {
        math: {
          class: MathEx,
          inLineToolbar: true
        },
        header: {
          class: Header,
          inLineToolbar: true
        },
        list: {
          class: List,
          inlineToolbar: [
            'link',
            'bold'
          ]
        },
        embed: {
          class: Embed,
          inlineToolbar: false,
          config: {
            services: {
              youtube: true,
              coub: true
            }
          }
        },
        warning: Warning,
        marker: MarkerTool,
        delimiter: Delimiter,
        table: Table,
        image: {
          class: SimpleImage,
          // inLineToolbar: true,
          config: {
            placeholder: 'Please input Caption...'
          }
        },
      },
      i18n: {
        messages: {
          ui: {
            "blockTunes": {
              "toggler": {
                "Click to tune": "点击修改",
                "or drag to move": "或者拖拽移动"
              },
            },
            "inlineToolbar": {
              "converter": {
                "Convert to": "转化成"
              }
            },
            "toolbar": {
              "toolbox": {
                "Add": "添加"
              }
            }
          },

          toolNames: {
            "Text": "文字",
            "Heading": "标题",
            "List": "列表",
            "Warning": "提醒",
            "Checklist": "多选框",
            "Quote": "引用",
            "Code": "代码",
            "Delimiter": "分隔符",
            "Raw HTML": "HTML代码",
            "Table": "表格",
            "Link": "链接",
            "Marker": "标记",
            "Bold": "粗体",
            "Italic": "斜体",
            "InlineCode": "行内代码",
            "Image": "图片",
            "MarkerTool":"批改笔",
            "MathEx":"数学编辑器"
          },

          tools: {
            "warning": { // <-- 'Warning' tool will accept this dictionary section
              "Title": "标题",
              "Message": "信息",
            },
            "link": {
              "Add a link": "添加链接"
            },
            "stub": {
              'The block can not be displayed correctly.': '这行显示不正确'
            },
            "image": {
              "Paste an image URL...": "请输入图片地址...",
              'Please input Caption...': "请输入图片标题...",
              "Caption...":"标题...",
              'withBorder': '加边框',
              'stretched': '放大',
              'withBackground':'加背景',
            }
          },

          /**
           * Section allows to translate Block Tunes
           */
          blockTunes: {
            /**
             * Each subsection is the i18n dictionary that will be passed to the corresponded Block Tune plugin
             * The name of a plugin should be equal the name you specify in the 'tunes' section for that plugin
             *
             * Also, there are few internal block tunes: "delete", "moveUp" and "moveDown"
             */
            "delete": {
              "Delete": "删除"
            },
            "moveUp": {
              "Move up": "往上移"
            },
            "moveDown": {
              "Move down": "往下移"
            },
            "withBorder":{
              "withBorder":"边框"
            }
          },
        }
      }
    });
  },
  methods: {
    save() {
      this.editor.save().then((outputData) => {

        const output = document.getElementById('output');
        output.innerHTML = JSON.stringify(outputData, null, 4);
      }).catch((error) => {
        console.error('Saving Failed: ', error);
      })
    },
    cur_time() {
      let currentdate = new Date();
      return currentdate.getDate() + "/"
          + (currentdate.getMonth() + 1) + "/"
          + currentdate.getFullYear() + "  " +
          currentdate.getHours() + ":" + currentdate.getMinutes();
    },
    input(str) {
      let mathFieldSpan = document.getElementById('math-field');
      let MQ = MathQuill.getInterface(2);
      this.mathField = MQ.MathField(mathFieldSpan, {
        spaceBehavesLikeTab: true,
        // handlers: {
        //   edit: function() {
        //     this.mathField.focus();
        //   }
        // }
      });
      this.mathField.cmd(str);
      this.mathField.focus();
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