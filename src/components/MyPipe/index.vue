<template>
  <div>
    <svg id="svg" style="width: 500; height: 500; margin: 0 auto">
        <defs id="defs"></defs>
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
import pg from "./pipe-generate.js";
import * as d3 from 'd3';
import * as d3_path from 'd3-path';

export default {
  name: "BubblePipe",
  data() {
    return {
      list:[[45,45],[57,77],[81,91],[115,125],[145,155],[175,185],[205,215],[235,245],
            [255,255],[245,235],[215,205],[185,175],[155,145],[125,115],[91,81],[77,57]],
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
    appendToDefs(defs,direction,color,id){
      var linearGradient = defs.append("linearGradient")
                               .attr("id", "linear-gradient")
                               .attr("id",id);
      linearGradient.attr("x1",direction.x1)
                    .attr("y1",direction.y1)
                    .attr("x2",direction.x2)
                    .attr("y2",direction.y2);
      //Set the color for the start (0%)
      linearGradient.append("stop")
                    .attr("offset", "0%")
                    .attr("stop-color", "#e76818"); //light blue

      //Set the color for the end (100%)
      linearGradient.append("stop")
                    .attr("offset", "60%")
                    .attr("stop-color", "#d7191c"); //dark blue

    },
    start: function () {
      var mySvg = document.getElementById("svg");
      var path = this.appendSVG(mySvg, "path");
      this.attr(path, {
          d: pg.generateLine(this.list),
          opacity: 0.7,
          fill: "crimson",
          stroke: "black"
        });
      path.setAttribute("stroke-linejoin","round")
      var defs = d3.select("#defs")
      //var line = this.appendSVG(defs, "")
      let dir= {x1:0,y1:0,x2:1,y2:1}
      this.appendToDefs(defs,dir,null,"first")
      path.setAttribute("fill","url(#first)")
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
