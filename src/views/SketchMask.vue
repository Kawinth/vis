<template>
  <div class="home">
    <!-- 管网信息编辑组件 -->
    <pipeline-info-window v-if="pipeLineInfoEditVisible"></pipeline-info-window>
    <marker-info-edit-window v-if="markerInfoEditVisible"></marker-info-edit-window>
    <div :class="{trans1:drawerVisible,trans2:!drawerVisible,sideBar:true}">
      <div>
        <div class="tips" @click="drawerVisible = !drawerVisible">
          <i v-show="!drawerVisible" class="el-icon-caret-left"></i>
          <i v-show="drawerVisible" class="el-icon-caret-right"></i>
        </div>
        <div class="right-drawer">
          <operation-panel></operation-panel>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import OperationPanel from '@/components/OperationPanel/index.vue'
import PipelineInfoWindow from "@/components/OperationPanel/PipelineInfoEditWindow";
import {mapState} from "vuex";
import MarkerInfoEditWindow from "@/components/OperationPanel/MarkerInfoEditWindow";

export default {
  name: 'SketchMask',
  components: {MarkerInfoEditWindow, PipelineInfoWindow, OperationPanel},
  computed: {
    ...mapState({
      pipeLineInfoEditVisible: (state) => state.view.pipeLineInfoEditVisible,
      markerInfoEditVisible: (state) => state.view.markerInfoEditVisible,
      lineVisible: (state) => state.view.lineVisible,
      ribbonVisible: (state) => state.view.ribbonVisible,
      heatLineVisible: (state) => state.view.heatLineVisible,
    }),
  },
  data() {
    return {
      drawerVisible: false,
      direction: 'rtl',
    };
  },
}
</script>
<style scoped>
.right-drawer {
  top: 80px;
  width: 600px;
  height: 857px;
  background: rgb(248, 247, 250);
  border: 2px solid #d4d1d1;
}

.sideBar {
  z-index: 1025;
  position: fixed;
  right: -10px;
  top: 80px;
  background-color: #ffffff;
  transition: right 0.5s;
}
.trans1 {
  right: 0px;
}
.trans2 {
  right: -600px;
}

.sideBar > div {
  position: relative;
}

.sideBar .tips {
  position: absolute;
  height: 40px;
  line-height: 25px;
  background-color: #006699;
  width: 40px;
  left: -40px;
  top: 435px;
  text-align: center;
  box-sizing: border-box;
  padding: 10px 10px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  font-weight: bold;
  color: #ffffff;
}
.sideBar .tips:hover{
  cursor: pointer;
}

</style>
