<template>
  <aside>
      <ul>
          <li v-for="(item,index) in tree">{{item.name}}</li>
      </ul>
  </aside>
</template>

<script>
  export default {
    computed: {
      tree() {
        return this.$store.state.treeLst
      }
    }
  }

</script>
<style lang="scss">
  @import '../style/sass/aside.scss'

</style>
