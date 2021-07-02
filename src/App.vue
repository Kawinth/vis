<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Gis管网管理</router-link> |
      <router-link to="/about">BubbleSets</router-link> |
      <router-link to="/pipe">管网仿真计算</router-link> |
      <router-link to="/demo">D3学习Demo</router-link> |
      <router-link to="/mp">demo</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>

* {
	margin:0px;
	padding: 0px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}


</style>
