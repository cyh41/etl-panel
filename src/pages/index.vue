<template>
  <div class="container">
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
    }
  }

</script>
<style lang="scss">
  @import '../style/sass/layout.scss'

</style>
