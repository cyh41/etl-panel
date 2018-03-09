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
        setpanelline({commit},obj){
            commit("SETPANELLINE",obj)
        },
        startlinelst({commit},obj){
            commit("STARTLINELST",obj)
        },
        drawlinelst({commit},obj){
            commit("DRAWLINELST",obj)
        },
        endlinelst({commit},obj){
            commit("ENDLINELST",obj)
        },
        updatelinelst({commit},obj){
            commit("UPDATELINELST",obj)
        },
        deletelinelst({commit},obj){
            commit("DELETELINELST",obj)
        },
        deletepanellst({commit},index){
            commit("DELETEPANELLST",index)
        }
}