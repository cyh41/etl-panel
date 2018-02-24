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
        _end = end.bind(this);//如果不酱紫无法解除绑定

    function start(event) {
        this.boundary = this.getBoundary();
        this.startPosition = {
          x: event.pageX,
          y: event.pageY
        }

        this.sourcePosition = this.panel ? {
          x: this.binding.x,
          y: this.binding.y
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
          if(!this.panel){
            if(this.currentX < this.boundary.left){
                this.setData(0,0);
              }else if(this.currentX> this.boundary.left && event.x-this.offsetX < this.boundary.left){
                this.setData(this.translateX-(event.x-this.offsetX - this.boundary.left),this.translateY);
              }
          }
        document.removeEventListener('mousemove', _move)
        document.removeEventListener('mouseup', _end)
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
    lst.splice(this.index,1,item);
  }
}

export default Drag;
