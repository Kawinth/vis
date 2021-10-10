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
      <el-table-column label="weight" width="128">
        <template slot-scope="scope">
          <el-input
              placeholder="请输入weight"
              v-model="scope.row.weight"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="value" width="128">
        <template slot-scope="scope">
          <el-input
              placeholder="请输入value"
              v-model="scope.row.value"
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
    <el-form ref="form" :model="pipeLineInfo" label-width="80px">
      <el-form-item label="管线名" prop="name" class="item">
        <avue-input v-model="pipeLineInfo.name" placeholder="管线名必填"></avue-input>
      </el-form-item>
      <el-form-item label="起点流量" class="item">
        <avue-input v-model="pipeLineInfo.flow"></avue-input>
      </el-form-item>
      <el-form-item label="起点液压" class="item">
        <avue-input v-model="pipeLineInfo.hydraulicPressure"></avue-input>
      </el-form-item>
      <el-form-item label="摩阻系数" class="item">
        <avue-input v-model="pipeLineInfo.frictionCoefficient"></avue-input>
      </el-form-item>
      <el-form-item label="管径" class="item">
        <avue-input v-model="pipeLineInfo.diameter"></avue-input>
      </el-form-item>
      <el-form-item label="分组编号" class="item">
        <avue-input v-model="pipeLineInfo.groupNumber"></avue-input>
      </el-form-item>
      <el-form-item label="像素宽度" class="item">
        <avue-input v-model="pipeLineInfo.lineWeight"></avue-input>
      </el-form-item>
      <el-form-item label="颜色" class="item">
        <avue-input-color
            placeholder="请选择颜色"
            v-model="pipeLineInfo.lineColor"
        ></avue-input-color>
      </el-form-item>
      <el-form-item label="水流方向" class="item">
        <avue-radio v-model="pipeLineInfo.direction" :dic="dic"></avue-radio>
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
import {addPipe, updatePipe} from "@/api/pipe-network";
import {mapMutations} from 'vuex'

export default {
  name: "PipelineInfoWindow",
  data() {
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
  computed: {
    pipeLineInfo: {
      get: function () {
        return this.$store.state.view.pipeLineInfo
      },
      set: function (value) {
        this.$store.state.view.pipeLineInfo = value
      },
    },
  },
  methods: {
    ...mapMutations({
      // 将 `this.commitVisible()` 映射为 `this.$store.commit('view/commitPipeLineInfoEditVisible')`
      commitVisible: 'view/commitPipeLineInfoEditVisible',
      changeServerStatus: 'map/SET_SERVER_CHANGED',
    }),
    addPoint(index, nodes) {
      nodes.splice(index + 1, 0, {lat: null, lng: null});
    },
    deletePoint(index, nodes) {
      nodes.splice(index, 1);
    },
    onSubmit() {
      if (this.pipeLineInfo.name === "") {
        console.log(this.nodes)
        this.$message({
          message: "请填写管线名",
          type: "warning",
        });
      } else {
        //转换nodes格式为后端需要的数组格式
        let temp = [];
        this.nodes.forEach((node) => {
          let array = [];
          array.push(Number(node.lat));
          array.push(Number(node.lng));
          this.pipeLineInfo.heatLineValues.push(Number(node.value));
          this.pipeLineInfo.heatLineWeights.push(Number(node.weight));
          temp.push(array);
        });
        this.pipeLineInfo.nodes = temp;
        //id为空证明是新建的
        if (this.pipeLineInfo.id !== null) {
          updatePipe(this.pipeLineInfo).then((res) => {
            this.changeServerStatus();
          });
        } else {
          addPipe(this.pipeLineInfo).then((res) => {
            this.changeServerStatus();
          });
        }
        this.commitVisible(false);
      }
    },
    cancel() {
      this.commitVisible(false);
    },
  },
  mounted() {
    this.pipeLineInfo.nodes.forEach((node) => {
      let temp = {lat: node[0], lng: node[1], value: 0, weight: 0};
      this.nodes.push(temp);
    });
  },
}
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
  left: calc(35vw);
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
