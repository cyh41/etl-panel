<template>
  <div class="container" @click="hideMenu()">
    <Header></Header>
    <Aside></Aside>
    <Panel></Panel>
  </div>
</template>
<script>
  import Header from '../components/header.vue'
  import Aside from '../components/aside.vue'
  import Panel from '../components/panel.vue'

  export default {
    components: {
      Header,
      Aside,
      Panel
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
