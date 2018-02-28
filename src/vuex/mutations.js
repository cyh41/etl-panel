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
      id: id
    })
  },
  DRAWLINELST(state,obj){
    let index = obj.index;
    let line = state.lineLst[index];
    line['x2'] = obj.x;
    line['y2'] = obj.y;
    if(obj.endIndex)line['endIndex'] = obj.endIndex;
    state.lineLst.splice(index,1,line);
  },
  ENDLINELST(state,obj){

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
    let index = obj.index;
    state.lineLst.splice(index,1);
  }
}
