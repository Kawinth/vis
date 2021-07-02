<template>
  <div>
    <svg id="svg" style="width: 1000; height: 500; margin: 0 auto">
      <defs id="defs"></defs>
      <!-- <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        style="stroke: black; stroke-width: 1; fill: none"
      ></rect> -->
    </svg>
  </div>
</template>

<script>
import pg from "./pipe-generate.js";
import * as d3 from "d3";

export default {
  name: "Pipe1",
  data() {
    return {
      pointList: [
        { x: 50, y: 50 },
        { x: 200, y: 100 },
        { x: 250, y: 300 },
      ],
      //损失系数
      alpha: 0.063,
      w: 30,
      colors: ["black", "red", "green", "blue"],
    };
  },
  methods: {
    appendToDefs(defs, direction, color, id) {
      var linearGradient = defs
        .append("linearGradient")
        .attr("id", "linear-gradient")
        .attr("id", id);
      linearGradient
        .attr("x1", direction.x1)
        .attr("y1", direction.y1)
        .attr("x2", direction.x2)
        .attr("y2", direction.y2);
      //Set the color for the start (0%)
      linearGradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#e76818"); //light blue

      //Set the color for the end (100%)
      linearGradient
        .append("stop")
        .attr("offset", "60%")
        .attr("stop-color", "#d7191c"); //dark blue
    },
    start: function (d) {
      var mySvg = d3.select("#svg")
      var path = mySvg.append("path");
      path.attr("d",d)
        .attr("opacity",0.7)
        .attr("fill","crimson")
        .attr("stroke","black")
        .attr("stroke-linejoin", "round");
      var defs = d3.select("#defs");
      //var line = this.appendSVG(defs, "")
      let dir = { x1: 0, y1: 0, x2: 1, y2: 1 };
      this.appendToDefs(defs, dir, null, "first");
      path.attr("fill", "url(#first)");
    },
    drawCoordinateAxis() {
      let svg = d3.select("svg");
      var xScale = d3.scaleLinear().domain([0, 1000]).range([0, 1000]);

      var xAxis = d3.axisBottom().scale(xScale).tickSize(10);
      var yAxis = d3.axisRight(xScale).ticks(10);

      svg
        .append("g")
        .call(xAxis)
        .attr("transform", "translate(0,0)")
        .selectAll("text")
        .attr("font-size", "10px")
        .attr("dx", "0px");

      svg
        .append("g")
        .call(yAxis)
        .attr("transform", "translate(0,0)")
        .selectAll("text");
    },
    generatePath(pointList){
    
      // let size = pointList.length;
      // let anchoPoints = new Array();
      // if(size < 2){
      //   console.log("不足以生成Path")
      // } else if(size == 2) {
      //   return;
      // } else if (size == 3) {
      //   return this.generateAnchorPoints(pointList[0],pointList[1],startWidth,alpha);
      // }
      let path = "M" + pointList[0].x + "," + pointList[0].y;
      path += " L"+ pointList[1].x + "," + pointList[1].y;
      path += pg.generateCurv(pointList[1],pointList[2],3,true);
      path += " L" + pointList[3].x + "," + pointList[3].y;
      path += pg.generateCurv(pointList[3],pointList[0],2.8,false);
      return path;
    },
  },
  mounted() {
    this.drawCoordinateAxis();
    //this.start();
    let temp = pg.generateAnchorPoints(this.pointList[0],this.pointList[1],this.w,this.alpha);
    console.log(temp)
    let svg = d3.select("#svg");
    for(var i in temp){
      svg.append("circle").attr("cx",temp[i].x).attr("cy",temp[i].y).attr("r",2).attr("fill",this.colors[i])
    }
    let path = this.generatePath(temp);
    this.start(path);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map {
  width: 100%;
  height: calc(90vh);
  z-index: 1;
}
</style>
