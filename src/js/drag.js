/**
 @class Drag
 *
 @constructor
 *
 @param {any} el
 @param {panel,id,vue} binding  el是否再panel中，el在数组中的id, vue实例
 */
class Drag {
  constructor(box, binding) {
    this.box = box;
    this.binding = binding;
    this.tree = binding.value.tree;
    this.vue = this.binding.value.vue;

    this.setDrag();
  }
  setDrag() { //主方法
    this.box.addEventListener('mousedown', start.bind(this), false);

    let _move = move.bind(this),
      _end = end.bind(this); //绑定this

    function start(event) {
      const target = event.target;
      this.getBoundary.call(this); //获取各容器的宽高，用来计算边距

      if (target.tagName === "ul") return;

      this.el = target.tagName.toLowerCase() === "li" ? target : target.parentNode;
      this.el = this.el.nodeName.toLowerCase() === "li" ? this.el : this.el.parentNode;

      if (target.classList.contains("startLine")) {//点击尾部
        this.panel = this.vue.$store.state.panelLst;
        let line = this.vue.$store.state.lineLst,
          lineLen = line.length,
          idNumber = lineLen ? parseInt(line[lineLen - 1].id.substr(1)) : -1;
        let id = 'l' + (idNumber + 1),
        startId = this.el.getAttribute("data-id");
        this.vue.$store.dispatch('startlinelst', {
          startId: startId,
          id: id
        })

        let panelItem = this.getVal(this.panel, startId);
        this.vue.$store.dispatch('updatepanellst', {
          id: startId,
          item: panelItem
        });
        this.vue.inDraw = startId;
        this.vue.isEnd = panelItem.endItem;
        let el_panel = document.getElementsByClassName('panel')[0];

        let draw = drawLine.bind(this),
          end = endLine.bind(this);

        el_panel.addEventListener('mousemove', draw, false);
        document.addEventListener('mouseup', end, false);

        function drawLine(event) { //线跟着鼠标走
          if (!this.vue.inDraw) return;
          let boundary = JSON.parse(sessionStorage.getItem('boundary'));
          let x = event.pageX - boundary.aside_width,
            y = event.pageY - boundary.header_height;
          this.vue.$store.dispatch('drawlinelst', {
            x: x,
            y: y,
            id: id
          })
        }

        function endLine(event) {
          el_panel.removeEventListener('mousemove', draw, false);
          document.removeEventListener('mouseup', end, false);
          if (event.target.className == 'line-head') {
            let line_head = event.target;
            let endId = line_head.getAttribute('data-id');
            let endPanel = this.getVal(this.panel, endId),
              startPanel = this.getVal(this.panel, startId);

            startPanel['endItem'].push(endId)
            startPanel['line'].push(id)
            endPanel['line'].push(id)
            this.vue.$store.dispatch('drawlinelst', { //最终位置
              x: endPanel.end.x,
              y: endPanel.end.y,
              endId: endId,
              id: id
            })
            this.vue.$store.dispatch('updatepanellst', {
              id: startId,
              item: startPanel
            })
          } else {
            this.vue.$store.dispatch('deletelinelst', { //没在最终位置则删除线
              id: id
            })
          }
          this.vue.inDraw = '';
          this.vue.isEnd = [];
        }
        return;
      }

      if(event.target.classList.contains("close")){
        let id = this.el.getAttribute("data-id");
        let item = this.getVal(this.vue.panel,id);
        let self = this.vue;
        let [...itemLine] = item.line;//拷贝包含的线的数组
        itemLine.forEach(v1 => {
          this.vue.line.some(v2 => {
            if (v2.id === v1) {
              self.deleteLine.call(self, null,v2.id);
            }
          })
        });
        this.vue.$store.dispatch('deletepanellst', id)
      }
      if (this.tree) {
        this.startIndex = this.el.getAttribute("data-index");
      } else {
        if (!target.classList.contains("drag")) return;
        this.id = this.el.getAttribute("data-id");
      }

      this.startX = event.pageX;
      this.startY = event.pageY;

      let panelLst = this.vue.$store.state.panelLst;
      if (this.id) { //panel的元素
        this.lst = panelLst;
        let self = this;
        this.lst.some(function (v) {
          if (v.id === self.id) {
            self.item = v;
          }
        });
        this.sourceX = parseInt(this.item.x);
        this.sourceY = parseInt(this.item.y);
      } else { //tree的元素
        this.lst = this.vue.$store.state.treeLst;
        this.item = this.lst[this.startIndex];

        this.sourceX = 0;
        this.sourceY = 0;
      }

      this.el_a_w = this.el.querySelector('a').offsetWidth; //当前元素的a标签的宽度

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
      if (!this.id) { //从备选面板到备选面板则回归原来位置
        if (this.currentX - this.offsetX < this.aside_width) {
          this.setData(0, 0);
          return false;
        }

        //对象深拷贝
        let panelItem = JSON.parse(JSON.stringify(this.vue.$store.state.treeLst[this.startIndex])),
          treeItem = JSON.parse(JSON.stringify(panelItem));

        treeItem['x'] = 0;
        treeItem['y'] = 0;

        let x = this.currentX - this.aside_width - this.offsetX,
          y = this.currentY - this.header_height - this.offsetY;

        panelItem['x'] = x > 0 ? x : 0;
        panelItem['y'] = y > 0 ? y : 0;

        if (!this.id) {
          let panelLst = this.vue.$store.state.panelLst;
          let idNumber = panelLst.length ? parseInt(panelLst[panelLst.length - 1].id.substr(1)) : -1;
          panelItem['id'] = 'i' + (idNumber + 1);
        }

        panelItem['x'] = this.currentX + this.el_right <= this.panel_width + this.aside_width ? x : this.panel_width - this.el.offsetWidth - 1;

        panelItem['y'] = this.currentY + this.el_bottom <= this.header_height + this.panel_height ? y : this.panel_height - this.el.offsetHeight - 2;

        if (this.currentY - this.offsetY < this.header_height) {
          panelItem['y'] = 0;
        }

        panelItem['line'] = []; //存放line
        panelItem['endItem'] = []; //存放尾部关联

        //将treeLst还原，新push元素到panelLst
        this.vue.$store.dispatch("updatetreelst", {
          index: this.startIndex,
          item: treeItem
        })
        this.vue.$store.dispatch("addpanellst", {
          item: this.setLinePosition(panelItem.x, panelItem.y, panelItem)
        })
      }
    }
  }
  getVal(lst, id) {
    let self = this,
      val;
    lst.some(v => {
      if (v.id === id) {
        val = v;
      }
    });
    return val;
  }
  getBoundary() { //获取边界值
    this.header_height = document.getElementsByTagName('header')[0].offsetHeight;
    this.aside_width = document.getElementsByTagName('aside')[0].offsetWidth;

    let panel = document.getElementsByClassName('panel')[0];
    this.panel_width = panel.offsetWidth;
    this.panel_height = panel.offsetHeight;
    let obj = {
      header_height: this.header_height,
      aside_width: this.aside_width,
      panel_width: this.panel_width,
      panel_height: this.panel_height
    }
    sessionStorage.setItem('boundary', JSON.stringify(obj))
  }
  setTranslate(pos) {
    this.currentX = pos.x; //当前位置
    this.currentY = pos.y;

    let distanceX = this.currentX - this.startX,
      distanceY = this.currentY - this.startY;

    this.translateX = (this.sourceX + distanceX).toFixed(),
      this.translateY = (this.sourceY + distanceY).toFixed();

    if (!this.getRange()) return; //超出范围
    this.setData(this.translateX, this.translateY, this.start, this.end);
  }

  setLinePosition(x, y, item) { //设置连线处的坐标
    item['start'] = {};
    item['end'] = {};
    item['end']['x'] = parseInt(x);
    item['end']['y'] = parseInt(y) + this.el.offsetHeight / 2;
    item['start']['x'] = parseInt(x) + this.el.offsetWidth;
    item['start']['y'] = parseInt(y) + this.el.offsetHeight / 2;
    return item;
  }

  setData(x, y, start, end) { //el属于tree or panel
    let lst = this.lst;
    let item = this.item;
    item['x'] = parseInt(x);
    item['y'] = parseInt(y);
    if (this.id) {
      this.vue.$store.dispatch('updatepanellst', {
        id: this.id,
        item: this.setLinePosition(x, y, item)
      })
    } else {
      this.vue.$store.dispatch('updatetreelst', {
        index: this.startIndex,
        item: this.setLinePosition(x, y, item)
      })
    }
  }

  getRange() { //是否超出范围
    let flag = true;
    if (this.currentY - this.offsetY <= this.header_height || this.currentX + this.el_right >= this.aside_width + this.panel_width || this.currentY + this.el_bottom >= this.panel_height + this.header_height) { //范围
      flag = false;
    }

    if (this.id && this.currentX - this.offsetX <= this.aside_width) {
      flag = false;
    }
    return flag;
  }
}

export default Drag;
