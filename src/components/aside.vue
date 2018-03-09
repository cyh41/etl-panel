<template>
  <aside>
    <div v-drag="{vue:Vue,tree:true}">
      <div v-for="(type,typeIdx) in tree">
        <h3 :class="['item',{'plus':type.hideItems}]" @click="toggleItems(typeIdx)">{{type.name}}</h3>
        <ul v-show="!type.hideItems">
          <li class="item" v-for="(item,idx) in type.items" :data-x="item.x" :data-y="item.y" :data-typeIndex="typeIdx" :data-index="idx" :style="{transform:`translate(${item.x}px,${item.y}px)`}">
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
      },
      sideArr(){
        return this.side;
      }
    },
    methods:{
      toggleItems(idx){
        let flag = this.tree[idx].hideItems;
        this.$set(this.tree[idx],"hideItems",!flag)
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
