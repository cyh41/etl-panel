export default {
        UPDATEPANELLST(state,obj){
            state.panelLst.splice(obj.index,1,obj.item)
        },
    UPDATETREELST(state,obj){
        state.treeLst.splice(obj.index,1,obj.item)
    },
    ADDPANELLST(state,obj){
        state.panelLst.push(obj.item)
    }
}