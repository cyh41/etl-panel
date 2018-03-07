<template>
  <aside>
    <ul v-drag="{vue:Vue,tree:true}" >
      <li v-for="(item,index) in tree"
      :data-x="item.x"
      :data-y="item.y"
      :data-index="index"
      :style="{transform:`translate(${item.x}px,${item.y}px)`}">
        <a>头部</a>
        <span>{{item.name}}</span>
        <a>尾部</a>
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
    data() {
      return {
        Vue: this
      }
    }
  }

</script>
<style lang="scss">
  @import '../style/sass/aside.scss'

</style>
