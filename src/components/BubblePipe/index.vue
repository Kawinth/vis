<template>
  <div>
    <svg id="svg" style="width: 500; height: 500; margin: 0 auto">
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        style="stroke: black; stroke-width: 1; fill: none"
      ></rect>
    </svg>
  </div>
</template>

<script>
import {
  BubbleSet,
  PointPath,
  ShapeSimplifier,
  BSplineShapeGenerator,
} from "./bubblesets.js";
import * as d3 from 'd3';

export default {
  name: "BubblePipe",
  data() {
    return {
      list:[[45,45],[55,65],[85,95],[115,125],[145,155],[175,185],[205,215],[235,245],
            [255,255],[245,235],[215,205],[185,175],[155,145],[125,115],[95,85],[65,55]],
      i:0,
      colors:["black","yellow","green","red"]
    };
  },
  methods: {
    attr(elem, attr) {
      // console.log(attr)
      for (let key in attr) {
        var value = attr[key];
        if (value === null) {
          elem.removeAttribute(key);
        } else {
          elem.setAttribute(key, value);
        }
      }
    },
    style(elem, style) {
      for (let key in style) {
        let value = style[key];
        if (value === null) {
          delete elem.style.removeProperty(key);
        } else {
          elem.style.setProperty(key, value);
        }
      }
    },
    appendSVG(parent, name) {
      return parent.appendChild(
        document.createElementNS("http://www.w3.org/2000/svg", name)
      );
    },
    removeAllChilds(parent) {
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
    },
    start: function () { 
      var mySvg = document.getElementById("svg");
      var bubbles = new BubbleSet();
      var path = this.appendSVG(mySvg, "path");
      this.updateOutline(this.list,"crimson",path);
    },
    updateOutline(list,color, path) {
    
      //绘制list点
      let svg = d3.select("#svg");
      for(var i in list){
        svg.append("circle").attr("cx",list[i][0]).attr("cy",list[i][1]).attr("r",2).attr("fill",this.colors[2])
      }
      this.i++;
      let outline = new PointPath(list).transform([
          new ShapeSimplifier(0.0),
          new BSplineShapeGenerator(),
          new ShapeSimplifier(0.0),
        ]);
      
      console.log(outline);
      this.attr(path, {
          d: outline,
          opacity: 0.5,
          fill: color,
          stroke: "black",
        });

    }
  },
  mounted() {
    
    let svg = d3.select("svg");

    var hull = d3.polygonHull(this.list);
    console.log(hull);
    var hullPath = svg.append("path")
    .datum(hull)
    .attr({
      d: function(d){
        return 'M'+ d.join('L') +'Z';
      },
      fill: 'steelblue',
      stroke: '#000',
    });
    var xScale = d3.scaleLinear()
    .domain([0, 500])
    .range([0, 500]);

    var xAxis = d3.axisBottom()
				.scale(xScale)
				.tickSize(10);
    var yAxis = d3.axisRight(xScale).ticks(10);

    svg.append('g')
				.call(xAxis)
				.attr("transform", "translate(0,0)")
				.selectAll("text")
				.attr("font-size", "10px")
				.attr("dx", "0px");

    svg.append('g')
				.call(yAxis).attr("transform", "translate(0,0)").selectAll("text");
    this.start();

    
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
