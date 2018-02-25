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
      right: pl.offsetWidth,
      bottom: pl.offsetHeight
    };
  }
  setDrag() {
    this.el.addEventListener('mousedown', start.bind(this), false);

    let _move = move.bind(this),
      _end = end.bind(this); //如果不这样无法解除绑定

    function start(event) {
      this.boundary = this.getBoundary();
      this.startPosition = {
        x: event.pageX,
        y: event.pageY
      }

      this.sourcePosition = this.panel ? { //获取初始translate的值
        x: parseInt(this.vue.$store.state.panelLst[this.index].x),
        y: parseInt(this.vue.$store.state.panelLst[this.index].y)
      } : {
        x: 0,
        y: 0
      }

      this.offsetX = event.offsetX;
      this.offsetY = event.offsetY; //用来计算元素到屏幕的边距

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
      if (!this.panel) {
        if (this.currentX - this.offsetX < this.boundary.left) {
          this.setData(0, 0);
          return false;
        }

        // if(!this.getRange());
        //将treeLst还原，新push元素到panelLst
        let newObj = JSON.parse(JSON.stringify(this.vue.$store.state.treeLst[this.index])),
          oldObj = JSON.parse(JSON.stringify(newObj));

        oldObj['x'] = 0;
        oldObj['y'] = 0;

        let x = this.currentX - this.boundary.left - this.offsetX,
          y = this.currentY - this.boundary.top - this.offsetY;

        
        newObj['x'] = x > 0 ? x : 0;
        newObj['y'] = y > 0 ? y : 0;

        let elRight = this.el.offsetWidth - this.offsetX,
        elBottom = this.el.offsetHeight - this.offsetY;

        newObj['x'] = this.currentX + elRight <= this.boundary.right ? x : this.boundary.right - this.el.offsetWidth - 1;
        
        newObj['y'] = this.currentY + elBottom <= this.boundary.top + this.boundary.bottom ? y : this.boundary.bottom - this.el.offsetHeight -2;
        
        if(this.currentY - this.offsetY < this.boundary.top){
          newObj['y'] = 0;
        }
        
        // newObj['y'] = this.currentY - this.offsetY > this.boundary.top ? y : 0;

        this.vue.$store.dispatch("updatetreelst", {
          index: this.index,
          item: oldObj
        })
        this.vue.$store.dispatch("addpanellst", {
          item: newObj
        })
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

      if(!this.getRange())return;
    this.setData(this.translateX, this.translateY);
  }

  setData(x, y) {
    let lst = this.panel ? this.vue.$store.state.panelLst : this.vue.$store.state.treeLst;
    let item = lst[this.index];
    item['x'] = parseInt(x);
    item['y'] = parseInt(y);

    let update = this.panel ? "updatepanellst" : "updatetreelst";

    this.vue.$store.dispatch(update, {
      index: this.index,
      item: item
    })
  }

  getRange() {
    let flag = true;
    let elRight = this.el.offsetWidth - this.offsetX,
      elBottom = this.el.offsetHeight - this.offsetY;

    if (this.currentY - this.offsetY <= this.boundary.top || this.currentX + elRight >= this.boundary.right + this.boundary.left || this.currentY + elBottom >= this.boundary.bottom + this.boundary.top) { //范围
      flag = false;
    }
    
    if(this.panel && this.currentX - this.offsetX <= this.boundary.left){
      flag = false;
    }
    return flag;
  }
}

export default Drag;
