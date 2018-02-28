export default {
  UPDATEPANELLST(state, obj) {
    state.panelLst.splice(obj.index, 1, obj.item)
  },
  UPDATETREELST(state, obj) {
    state.treeLst.splice(obj.index, 1, obj.item)
  },
  ADDPANELLST(state, obj) {
    state.panelLst.push(obj.item)
  },
  STARTLINELST(state, obj) {
    let panelItem = state.panelLst[obj.index],
      x1 = panelItem.start.x,
      y1 = panelItem.start.y,
      id = obj.id;
    state.lineLst.push({
      startIndex: obj.index,
      x1: x1,
      y1: y1,
      x2: x1,
      y2: y1,
      id: id
    })
  },
  DRAWLINELST(state,obj){
    let id = obj.id;
    state.lineLst.some((v,index) =>{
      if(parseInt(v.id) === parseInt(id)){
        v['x2'] = obj.x;
        v['y2'] = obj.y;
        if(obj.endIndex || parseInt(obj.endIndex) === 0)v['endIndex'] = obj.endIndex;
        state.lineLst.splice(index,1,v);
      }
    })
  },
  UPDATELINELST(state,obj){//根据拖拽更新线条
    let index = obj.index;
    let line = state.lineLst;
    for(let i=0,len=line.length;i<len;i++){
      if(line[i].startIndex == obj.index){
        line[i].x1 = obj.item.start.x;
        line[i].y1 = obj.item.start.y;
      } else if(line[i].endIndex == obj.index){
        line[i].x2 = obj.item.end.x;
        line[i].y2 = obj.item.end.y;
      }
    }
  },
  DELETELINELST(state,obj){
    let id = obj.id;
    state.lineLst.some((v,i) =>{
      if(parseInt(v.id) === parseInt(id)){
        state.lineLst.splice(i,1)
      }
    })
  }
}
