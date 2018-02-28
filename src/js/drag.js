/**
 @class Drag
 *
 @constructor
 *
 @param {any} el
 @param {panel,index,vue} binding  el是否再panel中，el再数组中位置, vue实例
 */
class Drag {
  constructor(el, binding) {
    this.el = el;
    this.binding = binding;
    this.vue = this.binding.value.vue;
    this.panel = this.binding.value.panel;
    this.index = this.binding.value.index;

    this.setDrag();
  }
  setDrag() { //主方法
    this.el.addEventListener('mousedown', start.bind(this), false);

    let _move = move.bind(this),
      _end = end.bind(this); //绑定this

    function start(event) {
      this.getBoundary.call(this);
      this.startX = event.pageX;
      this.startY = event.pageY;

      this.sourceX = this.panel ? parseInt(this.vue.$store.state.panelLst[this.index].x) : 0;
      this.sourceY = this.panel ? parseInt(this.vue.$store.state.panelLst[this.index].y) : 0;

      this.el_a_w = this.el.querySelector('a').offsetWidth;

      //用来计算鼠标到元素的边距
      this.offsetX = event.offsetX + this.el_a_w;
      this.offsetY = event.offsetY;

      //el以鼠标为分界线的上下
      this.el_right = this.el.offsetWidth - this.offsetX;
      this.el_bottom = this.el.offsetHeight - this.offsetY;

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
      if (!this.panel) { //从备选面板到备选面板则回归原来位置
        if (this.currentX - this.offsetX < this.aside_width) {
          this.setData(0, 0);
          return false;
        }

        //对象深拷贝
        let panelItem = JSON.parse(JSON.stringify(this.vue.$store.state.treeLst[this.index])),
          treeItem = JSON.parse(JSON.stringify(panelItem));

        treeItem['x'] = 0;
        treeItem['y'] = 0;

        let x = this.currentX - this.aside_width - this.offsetX,
          y = this.currentY - this.header_height - this.offsetY;


        panelItem['x'] = x > 0 ? x : 0;
        panelItem['y'] = y > 0 ? y : 0;

        console.log(this.currentX,this.el_right)
        panelItem['x'] = this.currentX + this.el_right <= this.panel_width + this.aside_width ? x : this.panel_width - this.el.offsetWidth - 1;

        panelItem['y'] = this.currentY + this.el_bottom <= this.header_height + this.panel_height ? y : this.panel_height - this.el.offsetHeight - 2;

        if (this.currentY - this.offsetY < this.header_height) {
          panelItem['y'] = 0;
        }

        panelItem['line'] = []; //存放line

        this.setLinePosition(x, y, panelItem);

        //将treeLst还原，新push元素到panelLst
        this.vue.$store.dispatch("updatetreelst", {
          index: this.index,
          item: treeItem
        })
        this.vue.$store.dispatch("addpanellst", {
          item: panelItem
        })
      }
    }
  }
  getBoundary() { //获取边界值
    this.header_height = document.getElementsByTagName('header')[0].offsetHeight;
    this.aside_width = document.getElementsByTagName('aside')[0].offsetWidth;
    this.panel_width = document.getElementsByClassName('panel')[0].offsetWidth;
    this.panel_height = document.getElementsByClassName('panel')[0].offsetHeight;
    let obj = {
      header_height: this.header_height,
      aside_width: this.aside_width,
      panel_width: this.panel_width,
      panel_height: this.panel_height
    }
    sessionStorage.setItem('boundary',JSON.stringify(obj))
  }
  setTranslate(pos) {
    this.currentX = pos.x; //当前位置
    this.currentY = pos.y;

    let distanceX = this.currentX - this.startX,
      distanceY = this.currentY - this.startY;

    this.translateX = (this.sourceX + distanceX).toFixed(),
      this.translateY = (this.sourceY + distanceY).toFixed();

    if (!this.getRange()) return;
    this.setData(this.translateX, this.translateY, this.start, this.end);
  }

  setLinePosition(x, y, item) {
    item['start'] = {};
    item['end'] = {};
    item['end']['x'] = parseInt(x);
    item['end']['y'] = parseInt(y) + this.el.offsetHeight / 2;
    item['start']['x'] = parseInt(x) + this.el.offsetWidth;
    item['start']['y'] = parseInt(y) + this.el.offsetHeight / 2;
  }

  setData(x, y, start, end) { //el属于tree or panel
    let lst = this.panel ? this.vue.$store.state.panelLst : this.vue.$store.state.treeLst;
    let item = lst[this.index];
    item['x'] = parseInt(x);
    item['y'] = parseInt(y);

    this.setLinePosition(x, y, item);

    let update = this.panel ? "updatepanellst" : "updatetreelst";

    this.vue.$store.dispatch(update, {
      index: this.index,
      item: item
    })
  }

  getRange() { //是否超出范围
    let flag = true;
    if (this.currentY - this.offsetY <= this.header_height || this.currentX + this.el_right >= this.aside_width + this.panel_width || this.currentY + this.el_bottom >= this.panel_height + this.header_height) { //范围
      flag = false;
    }

    if (this.panel && this.currentX - this.offsetX <= this.aside_width) {
      flag = false;
    }
    return flag;
  }
}

export default Drag;
