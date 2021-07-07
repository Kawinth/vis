<template>
  <el-row id="nav" type="flex" align="middle">
    <el-col :span="7" >
      <span style="font-size: 2.5em;color: #6699CC">UppaVis:</span>
      <span style="padding-left: 20px;font-size: 1.5em;">
        <span style="color: #6699CC">U</span>rban <span style="color: #6699CC">p</span>ipeline
        <span style="color: #6699CC">p</span>lanning
        <span style="color: #6699CC">a</span>ssistant
      </span>
    </el-col>
    <el-col :span="4" style="padding-left: 40px">
      <el-autocomplete
          v-model="condition.site"
          :fetch-suggestions="searchLocation"
          prefix-icon="el-icon-place"
          placeholder="Please enter location">
        <el-button slot="append" icon="el-icon-search" @click="searchLocation"></el-button>
        <template slot-scope="{ item }">
          <div class="name">{{ item.value }}</div>
          <span class="addr">{{ item.address }}</span>
        </template>
      </el-autocomplete>

    </el-col>
  </el-row>
</template>

<script>
import { OpenStreetMapProvider } from 'leaflet-geosearch';

export default {
  name: "NavBar",
  data(){
    const osp = new OpenStreetMapProvider();
    return {
      condition: {
        site: '',
      },
      searchResult: {},
      provider: osp,
    }
  },
  methods: {
    async searchLocation(){
      const results = await this.provider.search({ query: this.condition.site });
      console.log(results)
    }
  }
}
</script>

<style scoped>
#nav {
  width: 100%;
  height: 80px;
  background: #000000;
  color: #d4d1d1;
  font-family: Arial;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
