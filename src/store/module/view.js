
const state = {
    pipeLineInfoEditVisible: false,
    pipeLineInfo: null,
    markerInfoEditVisible: false,
    markerInfo: null,
    lineVisible: true,
    ribbonVisible: false,
    heatLineVisible: false
}

const mutations = {
    SET_PIPELINE_INFO_EDIT_VISIBLE: (state,visible) => {
        state.pipeLineInfoEditVisible = visible;
    },
    SET_PIPELINE_INFO: (state, info) => {
        state.pipeLineInfo = info;
    },
    SET_MARKER_INFO_EDIT_VISIBLE: (state, visible) => {
        state.markerInfoEditVisible = visible;
    },
    SET_MARKER_INFO: (state, info) => {
        state.markerInfo = info;
    },
    SET_LINE_VISIBLE: (state, visible) => {
        state.lineVisible = visible;
    },
    SET_RIBBON_VISIBLE: (state, visible) => {
        state.ribbonVisible = visible;
    },
    SET_HEAT_LINE_VISIBLE: (state, visible) => {
        state.ribbonVisible = visible;
    },
}

const actions = {

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
