
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
    commitPipeLineInfoEditVisible: (state,visible) => {
        state.pipeLineInfoEditVisible = visible;
    },
    commitPipeLineInfo: (state, info) => {
        state.pipeLineInfo = info;
    },
    commitMarkerInfoEditVisible: (state, visible) => {
        state.markerInfoEditVisible = visible;
    },
    commitMarkerInfo: (state, info) => {
        state.markerInfo = info;
    },
    commitLineVisible: (state, visible) => {
        state.lineVisible = visible;
    },
    commitRibbonVisible: (state, visible) => {
        state.ribbonVisible = visible;
    },
    commitHeatLineVisible: (state, visible) => {
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
