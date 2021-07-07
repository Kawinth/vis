<template>
  <div class="home">
    <div :class="{trans1:drawerVisible,trans2:!drawerVisible,sideBar:true}">
      <div>
        <div class="tips" @click="drawerVisible = !drawerVisible">
          <i v-show="!drawerVisible" class="el-icon-caret-left"></i>
          <i v-show="drawerVisible" class="el-icon-caret-right"></i>
        </div>
        <div class="right-drawer"></div>
      </div>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import LMap from '@/components/Map/PipeEdit.vue'

export default {
  name: 'SketchMask',
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
  background: #b942b3;
}

.sideBar {
  z-index: 2021;
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
  background-color: #eea236;
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
