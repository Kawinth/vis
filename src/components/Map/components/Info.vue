<template>
  <div id="info">
    <el-table
      :data="nodes"
      height="450"
      style="width: 600px"
      v-if="nodesVisible"
      id="nodes"
    >
      <el-table-column label="纬度" width="128">
        <template slot-scope="scope">
          <el-input
            placeholder="请输入纬度"
            v-model="scope.row.lat"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="经度" width="128">
        <template slot-scope="scope">
          <el-input
            placeholder="请输入经度"
            v-model="scope.row.lng"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-plus"
            type="primary"
            @click.native.prevent="addPoint(scope.$index, nodes)"
            circle
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-minus"
            @click.native.prevent="deletePoint(scope.$index, nodes)"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="管线名" prop="name" class="item">
        <avue-input v-model="form.name" placeholder="管线名必填"></avue-input>
      </el-form-item>
      <el-form-item label="管线长度" class="item">
        <avue-input v-model="form.length">米</avue-input>
      </el-form-item>
      <el-form-item label="管径" class="item">
        <avue-input v-model="form.diameter"></avue-input>
      </el-form-item>
      <el-form-item label="材质" class="item">
        <avue-input v-model="form.texture"></avue-input>
      </el-form-item>
      <el-form-item label="厂商" class="item">
        <avue-input v-model="form.manufacturer"></avue-input>
      </el-form-item>
      <el-form-item label="管线宽度" class="item">
        <avue-input v-model="form.lineWeight"></avue-input>
      </el-form-item>
      <el-form-item label="颜色" class="item">
        <avue-input-color
          placeholder="请选择颜色"
          v-model="form.lineColor"
        ></avue-input-color>
      </el-form-item>
      <el-form-item label="水流方向" class="item">
        <avue-radio v-model="form.direction" :dic="dic"></avue-radio>
      </el-form-item>
      <el-form-item label="节点组" class="item">
        <el-switch
          active-color="#13ce66"
          inactive-color="#ff4949"
          v-model="nodesVisible"
        >
        </el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updatePipe, addPipe } from "@/api/pipe-network";
import {addHeatLine} from "@/api/heat-line";

export default {
  name: "Info",
  props: ["form"],
  data() {
    //自定义方法区

    return {
      nodesVisible: false,
      mode: "update",
      dic: [
        {
          label: "正向",
          value: 1,
        },
        {
          label: "逆向",
          value: -1,
        },
      ],
      nodes: [],
    };
  },

  methods: {
    addPoint(index, nodes) {
      nodes.splice(index + 1, 0, { lat: null, lng: null });
    },
    deletePoint(index, nodes) {
      nodes.splice(index, 1);
    },
    onSubmit() {
      if (this.form.name === "") {
        this.$message({
          message: "请填写管线名",
          type: "warning",
        });
      } else {
        this.$store.commit("map/SET_INFO_VISIBLE", false);
        //转换nodes格式为后端需要的数组格式
        let temp = new Array();
        this.nodes.forEach((node) => {
          let array = new Array();
          array.push(new Number(node.lat));
          array.push(new Number(node.lng));
          temp.push(array);
        });
        this.form.nodes = temp;
        if (this.form.id !== null) {
          updatePipe(this.form).then((res) => {
            this.$store.commit("map/SET_SERVER_CHANGED");
          });
        } else {
          addHeatLine(this.form).then((res) => {
            this.$store.commit("map/SET_SERVER_CHANGED");
          });
        }
      }
    },
    cancel() {
      console.log(this.form);
      
      this.$store.commit("map/SET_INFO_VISIBLE", false);
      
    },
  },
  mounted() {
    this.form.nodes.forEach((node) => {
      let temp = { lat: node[0], lng: node[1] };
      this.nodes.push(temp);
    });
  },
};
</script>

<style scoped>
#info {
  /* width: 100px;
  height: 100px; */
  z-index: 2000;
  background: rgb(248, 247, 250);
  padding-top: 15px;
  padding-right: 20px;
  top: calc(15vh);
  left: calc(55vw);
  position: absolute;
  border: 2px solid #d4d1d1;
}
.item {
  margin-top: 10px;
  margin-bottom: 10px;
}
#nodes {
  top: calc(1vh);
  left: calc(22vw);
  position: absolute;
}
#el-form-item__content {
  margin-left: 5px;
}
/* #info :hover {
  border: 2px solid #ebebeb;
} */
</style>
