<template>
  <div class="container" @click="hideMenu()">
    <Header></Header>
    <Aside></Aside>
    <Panel></Panel>
    <Menu></Menu>
  </div>
</template>
<script>
  import Header from '../components/header.vue'
  import Aside from '../components/aside.vue'
  import Panel from '../components/panel.vue'
  import Menu from '../components/menu.vue'

  export default {
    components: {
      Header,
      Aside,
      Panel,
      Menu
    },methods: {
      hideMenu(){
        this.$store.state.menu.show = false;//点击其它地方，隐藏菜单
      }
    }
  }

</script>
<style lang="scss">
  @import '../style/sass/layout.scss'

</style>
