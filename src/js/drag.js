class Drag {
  constructor(el, binding) {
    this.el = el;
    this.binding = binding;
    this.vue = this.binding.value.vue;
    this.panel = this.binding.value.panel;
    this.index = this.binding.value.index;

    this.setDrag();
  }

  getBoundary() { //获取边界值
    let hd = document.getElementsByTagName('header')[0],
      ad = document.getElementsByTagName('aside')[0],
      pl = document.getElementsByClassName('panel')[0];

    return {
      top: hd.offsetHeight,
      left: ad.offsetWidth,
      right: ad.offsetWidth + pl.offsetWidth,
      bottom: hd.offsetHeight + pl.offsetHeight
    };
  }
  setDrag(){
    this.el.addEventListener('mousedown', start.bind(this), false);

    let _move = move.bind(this),
        _end = end.bind(this);//如果不这样无法解除绑定

    function start(event) {
        this.boundary = this.getBoundary();
        this.startPosition = {
          x: event.pageX,
          y: event.pageY
        }

        this.sourcePosition = this.panel ? {
          x: parseInt(this.vue.$store.state.panelLst[this.index].x),
          y: parseInt(this.vue.$store.state.panelLst[this.index].y)
        } : {
          x: 0,
          y: 0
        }

        this.offsetX = event.offsetX;
        this.offsetY = event.offsetY;//用来计算元素到屏幕的边距

        document.addEventListener('mousemove', _move, false)
        document.addEventListener('mouseup', _end, false)
      }

      function move(event) {
        this.setTranslate({
          x: event.pageX,
          y: event.pageY
        });
      }
    
      function end(event) {
        document.removeEventListener('mousemove', _move)
        document.removeEventListener('mouseup', _end)
          if(!this.panel){
            if(this.currentX < this.boundary.left){
                this.setData(0,0);
                return false;
              }
              //将treeLst还原，新push元素到panelLst
              let newObj = JSON.parse(JSON.stringify(this.vue.$store.state.treeLst[this.index])),
              oldObj = JSON.parse(JSON.stringify(newObj));

              oldObj['x'] = 0;
              oldObj['y'] = 0;

              let x = event.pageX - this.boundary.left - this.offsetX;
              newObj['x'] = x> 0 ? x : 0;
              newObj['y'] = event.pageY - this.boundary.top - this.offsetY;

              this.vue.$store.dispatch("updatetreelst",{index:this.index,item:oldObj})
              this.vue.$store.dispatch("addpanellst",{item:newObj})
              // this.vue.$store.state.panelLst.push(newObj);
              // this.vue.$store.state.treeLst.splice(this.index,1,oldObj);
          }
      }
  }

  setTranslate(pos) {
    this.currentX = pos.x;
    this.currentY = pos.y;

    let distanceX = this.currentX - this.startPosition.x,
      distanceY = this.currentY - this.startPosition.y;

    this.translateX = (this.sourcePosition.x + distanceX).toFixed(),
    this.translateY = (this.sourcePosition.y + distanceY).toFixed();

    // if(!this.panel && x <= this.boundary.left){
    //     return false;
    // }
    this.setData(this.translateX,this.translateY);
  }
  
  setData(x,y){
    let lst = this.panel ? this.vue.$store.state.panelLst : this.vue.$store.state.treeLst;
    let item = lst[this.index];
    item['x'] = x;
    item['y'] = y;
    
    let update = this.panel ? "updatepanellst" : "updatetreelst";

      this.vue.$store.dispatch(update,{index:this.index,item:item})
  }
}

export default Drag;
