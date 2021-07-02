<template>
  <div id="hello" class="myClass">
    <p>one</p>
    <p>two</p>
    <p>three</p>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "hello",
  data() {
    return {
      data: [1, 2, 3, 4],
    };
  },
  mounted() {
    //   document.onkeypress = (e) => {
    //       console.log(e);
    //   }
  
    console.log(d3);
    var svg = d3
      .select("#hello")
      .append("svg")
      .attr("width", 1000)
      .attr("height", 600)
      .style("background", "green");
    var hello = d3.select(".myClass");
    hello.classed("myClass", false);

    var p = d3.selectAll("p");
    p.datum("haha").text((d, i) => d);
    var temp = p.data(this.data);
    p.text((d, i) => d);
    console.log(temp.enter());
  },
};
</script>


<style scoped>
.myClass {
  background: rebeccapurple;
}
</style>