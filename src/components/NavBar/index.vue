<template>
  <div id="nav">

  </div>
</template>

<script>
export default {
  name: "NavBar"
}
</script>

<style scoped>
#nav {
  width: 100%;
  height: 80px;
  background: #000000;
  color: white;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
