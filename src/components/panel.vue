<template>
  <div class="panel">
    <ul v-drag="{vue:Vue}">
      <li v-for="(item,index) in panel" :id="item.id" :data-x="item.x" :data-y="item.y" :data-start="stringfy(item.start)" :data-end="stringfy(item.end)"
        :style="{transform:`translate(${item.x}px,${item.y}px)`}">
        <a :class="{'line-head': lineHead(item.id)}">头部</a>
        <span class="drag">{{item.name}}</span>
        <a class="startLine">尾部</a>
          <icon name="close" :scale="20" class="close"></icon>
      </li>
    </ul>
    <svg class="svgLineGroup" @dblclick="deleteLine($event)">
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#3d79bc"></path></marker>
      </defs>
      <line v-for="(item,index) in line" :x1="item.x1" :y1="item.y1" :x2="item.x2-12" :y2="item.y2" :data-id="item.id" marker-end="url(#arrow)" @contextmenu.stop.prevent="contentMenu($event,item.id)"/>
    </svg>
    <Menu @deleteline="deleteLine"></Menu>
  </div>
</template>

<script>
  import Drag from '../js/drag'
  import Menu from '../components/menu.vue'

  export default ({
    components:{
      Menu
    },
    methods: {
      stringfy(str) {
        return JSON.stringify(str);
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
      deleteLine(event, id) {
        let item;
        if (!event) {
          item = this.getVal(this.line, id);
        } else {
          let target = event.target;
          if (target.tagName === 'svg') return;
          item = this.getVal(this.line, target.getAttribute("data-id"))
        }
        let startId = item.startId,
          endId = item.endId;
        let start = this.getVal(this.panel, startId),
          end = this.getVal(this.panel, endId);

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
      getVal(lst, id) {
        let self = this,
          val;
        lst.some(v => {
          if (v.id === id) {
            val = v;
          }
        });
        return val;
      },
      contentMenu(event,id){
        let obj = {
          show:true,
          top:event.y,
          left: event.x
        };
        this.$store.dispatch("showmenu",obj)
        this.$store.state.lineId = id;
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
