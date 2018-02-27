<template>
  <div class="panel">
    <ul>
      <li v-for="(item,index) in panel" v-drag="{panel:true,index:index,vue:Vue}" :style="{transform:`translate(${item.x}px,${item.y}px)`}">
        <a class="line-head" :data-index="index">头部</a>
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
        this.inDraw = true;
        let el = document.getElementsByClassName('panel')[0];

        let draw = drawLine.bind(this),
          end = endLine.bind(this);

        el.addEventListener('mousemove', draw, false);
        document.addEventListener('mouseup', end, false);

        function drawLine(event) {//线跟着鼠标走
          if (!this.inDraw) return;
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
          console.log(el.attributes);
          let index = el.getAttribute('data-index');
          let panel = this.panel[index];
          let lineIndex = this.line.length - 1;

        this.$store.dispatch('drawlinelst', {
            x: panel.end.x,
            y: panel.end.y,
            index: lineIndex
          })
        } else{
        this.$store.dispatch('deletelinelst', {
          index:this.line.length - 1
        })
        }
        }
      },
    },
    computed: {
      panel() {
        return this.$store.state.panelLst
      },
      line() {
        return this.$store.state.lineLst
      }
    },
    watch: {
      panel: {
        handler: function (newVal, oldVal) {
          for (let i = 0, len = newVal.length; i < len; i++) {
            if (newVal[i] != oldVal[i]) {
              console.log(newVal[i])
            }
          }
        },
        deep: true
      }
    },
    data() {
      return {
        Vue: this,
        inDraw: ''
      }
    }
  })

</script>

<style lang="scss">
  @import '../style/sass/panel.scss'

</style>
