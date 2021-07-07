import {getList} from '@/api/pipe-network'


const state = {
  mode: 'normal',
  serverChanged: false,
  pipeList: [],
  infoVisible: false,
  focusHeatLineNodes: [],
  leafletMap: null,
}

const mutations = {
  SET_MODE: (state,mode) => {
    state.mode = mode;
  },
  SET_SERVER_CHANGED: (state) => {
    state.serverChanged = !state.serverChanged;
  },
  SET_PIPE_LIST: (state,list) => {
    state.pipeList = list;
  },
  SET_INFO_VISIBLE:(state,visible) => {
    state.infoVisible = visible;
  },
  SET_HEAT_LINE_NODES:(state,nodes) => {
    state.focusHeatLineNodes = nodes;
  },
  SET_LEAFLET_MAP:(state,map) => {
    state.leafletMap = map;
  }
}

const actions = {
  changeMode({ commit }, mode) {
    commit('SET_MODE', mode)
  },
  changePipeList({ commit }, page) {
    return new Promise((resolve, reject) =>{
      getList(page).then(response => {
        commit('SET_PIPE_LIST', response.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    });
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
