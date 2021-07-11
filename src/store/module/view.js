
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
    commitPipeLineInfoEditVisible: (state, visible) => {
        state.pipeLineInfoEditVisible = visible;
    },
    commitPipeLineInfo: (state, info) => {
        state.pipeLineInfo = info;
    },
    commitMarkerInfoEditVisible: (state) => {
        state.markerInfoEditVisible = !state.markerInfoEditVisible;
    },
    commitMarkerInfo: (state, info) => {
        state.markerInfo = info;
    },
    commitLineVisible: (state) => {
        state.lineVisible = !state.lineVisible;
    },
    commitRibbonVisible: (state) => {
        state.ribbonVisible = !state.ribbonVisible;
    },
    commitHeatLineVisible: (state) => {
        state.heatLineVisible = !state.heatLineVisible;
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
