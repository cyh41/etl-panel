<template>
  <div class="panel">
    <ul v-drag="{vue:Vue}">
      <li v-for="(item,index) in panel"
          :data-id="item.id"
          :data-x="item.x"
          :data-y="item.y"
          :data-start="item.start"
          :data-end="item.end"
          :style="{transform:`translate(${item.x}px,${item.y}px)`}">
        <a :class="{'line-head': lineHead(item.id)}"
           :data-id="item.id">{{item.id}}</a>
        <span class="drag" :data-id="item.id">{{item.name}}</span>
        <a class="startLine">尾部</a>
        <a @mouseup.stop="deleteItem($event,item.id)" class="close">x</a>
      </li>
    </ul>
    <svg class="svgLineGroup">
      <line v-for="(item,index) in line" @dblclick="deleteLine(item)" :x1="item.x1" :y1="item.y1" :x2="item.x2" :y2="item.y2" :data-id="item.id"
      />
    </svg>
  </div>
</template>

<script>
  import Line from '../js/svgLine'
  import Drag from '../js/drag'

  export default ({
    methods: {
      startLine(startId) {
        let line = this.line,
          lineLen = this.line.length,
          idNumber = lineLen ? parseInt(line[lineLen - 1].id.substr(1)) : -1;
        let id = 'l' + (idNumber + 1);
        this.$store.dispatch('startlinelst', {
          startId: startId,
          id: id
        })
        
        let panelItem = this.getVal(this.$store.state.panelLst,startId);
        this.$store.dispatch('updatepanellst', {
          id: startId,
          item: panelItem
        });
        this.inDraw = startId;
        this.isEnd = panelItem.endItem;
        let el_panel = document.getElementsByClassName('panel')[0];

        let draw = drawLine.bind(this),
          end = endLine.bind(this);

        el_panel.addEventListener('mousemove', draw, false);
        document.addEventListener('mouseup', end, false);

        function drawLine(event) { //线跟着鼠标走
          if (!this.inDraw) return;
          let boundary = JSON.parse(sessionStorage.getItem('boundary'));
          let x = event.pageX - boundary.aside_width,
            y = event.pageY - boundary.header_height;
          this.$store.dispatch('drawlinelst', {
            x: x,
            y: y,
            id: id
          })
        }

        function endLine(event) {
          el_panel.removeEventListener('mousemove', draw, false);
          document.removeEventListener('mouseup', end, false);
          if (event.target.className == 'line-head') {
            let line_head = event.target;
            let endId = line_head.getAttribute('data-id');
            let endPanel = this.getVal(this.panel,endId),
            startPanel = this.getVal(this.panel,startId);

            startPanel['endItem'].push(endId)
            startPanel['line'].push(id)
            endPanel['line'].push(id)
            this.$store.dispatch('drawlinelst', {//最终位置
              x: endPanel.end.x,
              y: endPanel.end.y,
              endId: endId,
              id: id
            })
            this.$store.dispatch('updatepanellst',{
              id: startId,
              item: startPanel
            })
          } else {
            this.$store.dispatch('deletelinelst', {//没在最终位置则删除线
              id: id
            })
          }
          this.inDraw = '';
          this.isEnd = [];
        }
      },
      lineHead(index) {
        let flag = true;
        if (index === parseInt(this.inDraw) || compare.call(this)) {
          flag = false;
        }
        return flag;

        function compare() {
          return this.isEnd.some(v => {
            return v == index;
          })
        }
      },
      deleteLine(item) {
        let startId = item.startId,
          endId = item.endId;
        let start = this.getVal(this.panel,startId),
          end = this.getVal(this.panel,endId);

        splice(start.endItem, endId)
        splice(start.line, item.id);
        splice(end.line, item.id);

        function splice(l, id) {
          l.some((v, i) => {
            if (v === id) {
              l.splice(i, 1)
            }
          })
        }
        this.$store.dispatch('updatepanellst', {
          id: startId,
          item: start
        })
        this.$store.dispatch('updatepanellst', {
          id: endId,
          item: end
        })
        this.$store.dispatch('deletelinelst', {
          id: item.id
        })
      },
      deleteItem(event,id) {
        let item = this.getVal(this.panel,id);
        let self = this;
        let [...itemLine] = item.line;//拷贝包含的线的数组
        itemLine.forEach(v1 => {
          this.line.some(v2 => {
            if (v2.id === v1) {
              self.deleteLine.call(self, v2);
            }
          })
        });
        this.$store.dispatch('deletepanellst', id)
        this.$forceUpdate()
      },
      getVal(lst, id) {
        let self = this,
          val;
        lst.some(v => {
          if (v.id === id) {
            val = v;
          }
        });
        return val;
      }
    },
    computed: {
      panel() {
        return this.$store.state.panelLst
      },
      line() {
        return this.$store.state.lineLst
      }
    },
    data() {
      return {
        Vue: this,
        inDraw: '',
        isEnd: [],
        aa:[
          {text:1},{text:2},{text:3},{text:4},{text:5},{text:6},
        ]
      }
    }
  })

</script>

<style lang="scss">
  @import '../style/sass/panel.scss'

</style>
