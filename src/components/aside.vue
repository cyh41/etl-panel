<template>
  <aside>
    <div v-drag="{vue:Vue,tree:true}">
      <div v-for="(type,index) in tree">
        <h3 class="item">{{type.name}}</h3>
        <ul>
          <li class="item" v-for="(item,index) in type.items" :data-x="item.x" :data-y="item.y" :data-index="index" :style="{transform:`translate(${item.x}px,${item.y}px)`}">
            <icon :name="item.icon" :scale="20"></icon><span>{{item.name}}</span>
          </li>
        </ul>
      </div>
    </div>
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
