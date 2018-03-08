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
        <a :class="{'line-head': lineHead(item.id)}">头部</a>
        <span class="drag">{{item.name}}</span>
        <a class="startLine">尾部</a>
        <a @mouseup.stop="deleteItem($event,item.id)" class="close">x</a>
      </li>
    </ul>
    <svg class="svgLineGroup" @dblclick="deleteLine($event)" >
      <line v-for="(item,index) in line" :x1="item.x1" :y1="item.y1" :x2="item.x2" :y2="item.y2" :data-id="item.id"
      />
    </svg>
  </div>
</template>

<script>
  import Drag from '../js/drag'

  export default ({
    methods: {
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
      deleteLine(event,id) {
        let item;
        if(!event){
          item = this.getVal(this.line,id);
        } else{
          let target = event.target;
          if(target.tagName === 'svg')return;
          item = this.getVal(this.line,target.getAttribute("data-id"))
        }
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
