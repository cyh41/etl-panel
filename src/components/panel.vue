<template>
  <div class="panel">
    <ul>
      <li v-for="(item,index) in panel" v-drag="{panel:true,index:index,vue:Vue}" :style="{transform:`translate(${item.x}px,${item.y}px)`}">
        <a :class="{'line-head': lineHead(index)}" :data-index="index" @mousedown.stop>头部</a>
        <span>{{item.name}}</span>
        <a @mousedown.stop="startLine(index,item.start,item.end)">尾部</a>
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
      startLine(startIndex) {
        let len = this.line.length,
        id = len ? parseInt(this.line[len-1].id) +1 : 0;
        this.$store.dispatch('startlinelst', {
          index: startIndex,
          id: id
        })
        let panelItem = this.$store.state.panelLst[startIndex];
        panelItem.line.push(len);//将新增的line加到line里面

        this.$store.dispatch('updatepanellst', {
          index: startIndex,
          item: panelItem
        })
        this.inDraw = startIndex;
        this.isEnd = panelItem.endItem;
        let el_panel = document.getElementsByClassName('panel')[0];

        let draw = drawLine.bind(this),
          end = endLine.bind(this);

        el_panel.addEventListener('mousemove', draw, false);
        document.addEventListener('mouseup', end, false);

        function drawLine(event) { //线跟着鼠标走
          if (!this.inDraw && this.inDraw != 0) return;
          let boundary = JSON.parse(sessionStorage.getItem('boundary'));
          let x = event.pageX - boundary.aside_width,
            y = event.pageY - boundary.header_height;
          let id = len ? this.$store.state.lineLst[len].id : 0;
          this.$store.dispatch('drawlinelst', {
            x: x,
            y: y,
            id: id
          })
        }

        function endLine(event) {
          el_panel.removeEventListener('mousemove', draw, false);
          document.removeEventListener('mouseup', end, false);
          let lineIndex = this.line.length - 1;
          if (event.target.className == 'line-head') {
            let line_head = event.target;
            let index = line_head.getAttribute('data-index');
            let panel = this.panel[index];
            let startIndex = this.inDraw;
            this.$store.state.panelLst[startIndex]['endItem'].push(index);

            let panelItem = this.$store.state.panelLst[index];
            panelItem.line.push(id);

            this.$store.dispatch('drawlinelst', {
              x: panel.end.x,
              y: panel.end.y,
              endIndex: parseInt(index),
              id: this.$store.state.lineLst[lineIndex].id
            })
          } else {
            this.$store.dispatch('deletelinelst', {
              id: this.$store.state.lineLst[lineIndex].id
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
        let startIndex = item.startIndex,
          endIndex = item.endIndex;
        let start = this.$store.state.panelLst[startIndex],
          end = this.$store.state.panelLst[endIndex];

        splice(start.endItem, endIndex)
        splice(start.line, item.id);
        splice(end.line, item.id);

        function splice(l, idx) {
          l.some((v, i) => {
            console.log(v,idx)
            if (parseInt(v) === parseInt(idx)) {
              l.splice(i, 1)
            }
          })
        }
        this.$store.dispatch('updatepanellst', {
          index: startIndex,
          item: start
        })
        this.$store.dispatch('updatepanellst', {
          index: endIndex,
          item: end
        })
        this.$store.dispatch('deletelinelst', {
          id: item.id
        })
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
        isEnd: []
      }
    }
  })

</script>

<style lang="scss">
  @import '../style/sass/panel.scss'

</style>
