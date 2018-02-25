<template>
  <ul class="panel">
    <li v-for="(item,index) in panel" v-drag="{panel:true,index:index,vue:Vue,x:item.x,y:item.y}" :style="{transform:`translate(${item.x}px,${item.y}px)`}">
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script>
  export default({
    methods:{
    },
  computed:{
    panel(){
      return this.$store.state.panelLst
    }
  },
  data(){
    return{
      Vue:this
    }
  }
})
</script>

<style lang="scss">
@import '../style/sass/panel.scss'
</style>

