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
    state.treeLst.splice(obj.index, 1, obj.item)
  },
  ADDPANELLST(state, obj) {
    state.panelLst.push(obj.item)
  },
  STARTLINELST(state, obj) {
    let panelItem = getVal(state.panelLst,obj.startId),
      x1 = panelItem.start.x,
      y1 = panelItem.start.y,
      startId = obj.startId,
      id =obj.id;
    state.lineLst.push({
      startId: startId,
      x1: x1,
      y1: y1,
      x2: x1,
      y2: y1,
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
