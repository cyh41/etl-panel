<template>
  <aside>
      <ul>
          <li v-for="(item,index) in tree" v-drag="{panel:false,index:index,vue:Vue,x:item.x,y:item.y}" :style="{transform:`translate(${item.x}px,${item.y}px)`}">
            <span>111</span>
            <span>{{item.name}}</span>
          </li>
      </ul>
  </aside>
</template>

<script>
  export default {
    computed: {
      tree() {
        return this.$store.state.treeLst
      }
    },
    data(){
      return {
        Vue:this
      }
    }
  }

</script>
<style lang="scss">
  @import '../style/sass/aside.scss'
</style>
