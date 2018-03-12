<template>
  <div class="annular-nav" :class="{'scale': menu.show}" :style="{'top': menu.top - menu_height/2 +'px','left': menu.left - menu_width/2 + 'px'}">
    <ul class="menu">
      <li v-for="item in menuLst">
        <icon :name="item.icon" :scale="20"></icon>
        <span>{{item.name}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    created() {
      this.menu_width = 0;
      this.menu_height = 0;
    },
    mounted() {
      let el = document.getElementsByClassName('annular-nav')[0];
      this.menu_width = el.offsetWidth,
        this.menu_height = el.offsetHeight;
    },
    computed: {
      menu() {
        return this.$store.state.menu;
      }
    },
    data() {
      return {
        menuLst: [{
          name: '关闭',
          id: 'close',
          icon: 'bigclose'
        },{
          name: '未开放',
          id: 'close',
          icon: 'hive'
        },{
          name: '未开放',
          id: 'close',
          icon: 'neo4j'
        },{
          name: '未开放',
          id: 'close',
          icon: 'hive'
        },{
          name: '未开放',
          id: 'close',
          icon: 'hbase'
        }]
      }
    }
  }

</script>
<style lang="scss">
  $liColumns: 6 !default;
  .annular-nav {
    position: absolute;
    width: 6em;
    height: 6em;
    transition: all .3s;
    transform: scale(0);
    z-index: 1;
    &.scale {
      transform: scale(1);
    }
    ul {
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      padding: 0;
      border: 1.4em solid #5093dd;
      margin: 0;
      border-radius: 50%;
      color: #fff;
      font-size: 12px;
      opacity: .8;
      @for $i from 0 through $liColumns {
        li:nth-of-type(#{$i}) {
          transform: rotate($i * 60deg);
          svg,span {
            transform: rotate( -45deg);
          }
        }
      }
      li {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: .2em;
        left: 0;
        width: 2em;
        height: 2em;
        border: 2px solid #d0e1f0;
        border-radius: 50%;
        background: #5093dd;
        transform-origin: 3.8em 3.8em;
        cursor: pointer;
        &:hover{
            border-color: #fff;
        }
        svg {
          width: 50%;
          height: 50%;
        }
        span{
            position: absolute;
            top: -1em;
            left: -1.8em;
            color: #000
        }
      }
    }
  }

</style>
