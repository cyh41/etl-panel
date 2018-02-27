export default {
        updatepanellst({commit},obj){
            commit("UPDATEPANELLST",obj)
            if(obj.item.line.length > 0){
                commit("UPDATELINELST",obj)
            }
        },
        updatetreelst({commit},obj){
            commit("UPDATETREELST",obj)
        },
        addpanellst({commit},obj){
            commit("ADDPANELLST",obj)
        },
        startlinelst({commit},obj){
            commit("STARTLINELST",obj)
        },
        updatelinelst({commit},obj){
            commit("UPDATELINELST",obj)
        }
}