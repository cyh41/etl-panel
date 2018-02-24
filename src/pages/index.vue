<template>
  <div class="container">
    <header></header>
    <Aside></Aside>
    <Panel></Panel>
  </div>
</template>
<script>
  import Aside from '../components/aside.vue'
  import Panel from '../components/panel.vue'

  export default {
    components: {
      Aside,
      Panel
    },
    computed: {},
    data() {
      return {}
    }
  }

</script>
<style lang="scss">
  @import '../style/sass/layout.scss'

</style>
