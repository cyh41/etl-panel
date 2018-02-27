<template>
  <div class="panel">
    <ul>
      <li v-for="(item,index) in panel" v-drag="{panel:true,index:index,vue:Vue}" :style="{transform:`translate(${item.x}px,${item.y}px)`}">
        <a>头部</a>
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

  export default ({
    methods: {
      startLine(index) {
        let len = this.line.length+1;
        this.$store.dispatch('startlinelst', {index:index,id:len})

        let panelItem = this.$store.state.panelLst[index];
        panelItem.line.push(len);
        this.$store.dispatch('updatepanellst', {
          index: index,
          item: panelItem
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
        Vue: this
      }
    }
  })

</script>

<style lang="scss">
  @import '../style/sass/panel.scss'

</style>
