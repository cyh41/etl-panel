export default {
  UPDATEPANELLST(state, obj) {
    let id = obj.id;
    state.panelLst.some((v,i) => {
      if(id === v.id){
        state.panelLst.splice(i, 1, obj.item)
      }
    })
  },
  UPDATETREELST(state, obj) {
    state.treeLst[obj.typeindex]["items"].splice(obj.index, 1, obj.item)
  },
  ADDPANELLST(state, obj) {
    state.panelLst.push(obj.item);
  },
  SETPANELLINE(state,obj){
    let item = obj.item,
    startX = parseInt(item.x) + parseInt(obj.width),
    startY = parseInt(item.y) + obj.height/2,
    start = {
      x: startX,
      y: startY
    };
    item.start = start;
    state.panelLst.splice(state.panelLst.length-1,1,item)
  },
  STARTLINELST(state, obj) {
    let startId = obj.startId,
      id =obj.id;
    state.lineLst.push({
      startId: startId,
      x1: obj.start.x,
      y1: obj.start.y,
      x2: obj.start.x,
      y2: obj.start.y,
      id: id
    })
  },
  DRAWLINELST(state,obj){
    let id = obj.id;
    state.lineLst.some((v,i) =>{
      if(v.id === id){
        v['x2'] = obj.x;
        v['y2'] = obj.y;
        v['endId'] = obj.endId;
        if(obj.endIndex || parseInt(obj.endIndex) === 0)v['endIndex'] = obj.endIndex;
        state.lineLst.splice(i,1,v);
      }
    })
  },
  UPDATELINELST(state,obj){//根据拖拽更新线条
    let item = obj.item,
    id = item.id;

    let line = state.lineLst;
      line.some((v,j) => {
        if(v.startId === id){
          v.x1 = item.start.x;
          v.y1 = item.start.y;
          line.splice(j,1,v);
        }else if(v.endId === id){
          v.x2 = item.end.x;
          v.y2 = item.end.y;
          line.splice(j,1,v);
        }
      })
  },
  DELETELINELST(state,obj){
    let id = obj.id;
    state.lineLst.some((v,i) =>{
      if(v.id === id){
        state.lineLst.splice(i,1)
      }
    })
  },
  DELETEPANELLST(state,id){
    state.panelLst.some((v,i) =>{
      if(v.id === id){
        state.panelLst.splice(i,1)
      }
    })
  }
}

function getVal(lst,id) {
  let self = this,val;
  lst.some(v =>{
    if(v.id === id){
      val = v;
    }
  });
  return val;
}
