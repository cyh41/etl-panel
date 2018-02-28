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
      <line v-for="(item,index) in line" :x1="item.x1" :y1="item.y1" :x2="item.x2" :y2="item.y2" />
    </svg>
  </div>
</template>

<script>
  import Line from '../js/svgLine'
  import Drag from '../js/drag'

  export default ({
    methods: {
      startLine(index) {
        let len = this.line.length + 1; //设置线的id
        this.$store.dispatch('startlinelst', {
          index: index,
          id: len
        })

        let panelItem = this.$store.state.panelLst[index];
        panelItem.line.push(len);
        
        this.$store.dispatch('updatepanellst', {
          index: index,
          item: panelItem
        })
        this.inDraw = index;
        this.isEnd = panelItem.endItem;
        let el = document.getElementsByClassName('panel')[0];

        let draw = drawLine.bind(this),
          end = endLine.bind(this);

        el.addEventListener('mousemove', draw, false);
        document.addEventListener('mouseup', end, false);

        function drawLine(event) {//线跟着鼠标走
          if (!this.inDraw && this.inDraw != 0) return;
          let boundary = JSON.parse(sessionStorage.getItem('boundary'));
          let x = event.pageX - boundary.aside_width,
            y = event.pageY - boundary.header_height;
          this.$store.dispatch('drawlinelst', {
            x: x,
            y: y,
            index: this.line.length - 1
          })
        }

        function endLine(event) {
        el.removeEventListener('mousemove', draw, false);
        document.removeEventListener('mouseup', end, false);
        if(event.target.className == 'line-head'){
          let el = event.target;
          let index = el.getAttribute('data-index');
          let panel = this.panel[index];
          let lineIndex = this.line.length - 1;
          let startIndex = this.inDraw;
          this.$store.state.panelLst[startIndex]['endItem'].push(index);

          let panelItem = this.$store.state.panelLst[index];
          panelItem.line.push(len);

        this.$store.dispatch('drawlinelst', {
            x: panel.end.x,
            y: panel.end.y,
            endIndex: parseInt(index),
            index: lineIndex
          })
        } else{
        this.$store.dispatch('deletelinelst', {
          index:this.line.length - 1
        })
        }
        this.inDraw = '';
        this.isEnd = [];
        }
      },
      lineHead(index){
        let flag = true;
        if(index === parseInt(this.inDraw) || compare.call(this)){
          flag = false;
        } 
        return flag;
        function compare() {
          return this.isEnd.some(v => {
          return v == index;
        })
        }
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
