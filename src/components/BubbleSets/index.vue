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
  name: "BubbleSets",
  data() {
    return {
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
      var bubbles = new BubbleSet();
      var rectanglesA = [];
      var rectanglesB = [];
      var mySvg = document.getElementById("svg");
      var items = this.appendSVG(mySvg, "g");
      var pathA = this.appendSVG(mySvg, "path");
      var pathB = this.appendSVG(mySvg, "path");
      var debug = this.appendSVG(mySvg, "g");
      bubbles.debug(false);
      var debugFor = pathA;

      function update() {
        console.log(rectanglesA);
        console.log(rectanglesB);
        updateOutline(rectanglesA, rectanglesB, "crimson", pathA);
        //console.log(mySvg);
        // updateOutline(rectanglesB, rectanglesA, "cornflowerblue", pathB);
        //console.log(mySvg);
      }

      function updateOutline(rectangles, otherRectangles, color, path) {
        var pad = 0;
        //console.log(BubbleSet.addPadding(rectangles, pad))
        var list = bubbles.createOutline(
          BubbleSet.addPadding(rectangles, pad),
          BubbleSet.addPadding(otherRectangles, pad),
          null /* lines */
        );


        //console.log(list.toString())
        let svg = d3.select("#svg");
        for(var i in list){
          svg.append("circle").attr("cx",list[i][0]).attr("cy",list[i][1]).attr("r",2).attr("fill",it.colors[it.i])
        }
        it.i++;
        
        //console.log(list)
        // rectangles need to have the form { x: 0, y: 0, width: 0, height: 0 }
        // lines need to have the form { x1: 0, x2: 0, y1: 0, y2: 0 }
        // lines can be null to infer lines between rectangles automatically
        var outline = new PointPath(list).transform([
          new ShapeSimplifier(0.0),
          new BSplineShapeGenerator(),
          new ShapeSimplifier(0.0),
        ]);
        // outline is a path that can be used for the attribute d of a path element
        it.attr(path, {
          d: outline,
          opacity: 0.5,
          fill: color,
          stroke: "black",
        });
        if (bubbles.debug() && path === debugFor) {
          this.removeAllChilds(debug);
          bubbles.debugPotentialArea().forEach(function (r) {
            var rect = this.appendSVG(debug, "rect");
            this.attr(rect, {
              x: r.x,
              y: r.y,
              width: r.width,
              height: r.height,
            });
            var color =
              r.value === r.threshold
                ? "0, 0, 0"
                : r.value > 0
                ? "150, 20, 20"
                : "20, 20, 150";
            this.style(rect, {
              fill: "rgb(" + color + ")",
              opacity:
                r.value === r.threshold
                  ? 0.5
                  : Math.min(255, Math.abs(r.value * 40)) / 255.0,
            });
          });
        }
      }

      function addRect(it, rectangles, color, cx, cy) {
        //console.log(rectangles);
        var width = 2;
        var height = 2;
        var x = cx - width * 0.5;
        var y = cy - height * 0.5;
        var elem = it.appendSVG(items, "rect");
        it.attr(elem, {
          x: x,
          y: y,
          width: width,
          height: height,
        });
        it.style(elem, {
          stroke: "black",
          "stroke-width": 1,
          fill: color,
        });
        rectangles.push({
          x: x,
          y: y,
          width: width,
          height: height,
          elem: elem,
        });
        update();
      }

      let it = this;
      mySvg.onclick = function (e) {
        var circle = d3.selectAll("circle")
        circle.remove();
        addRect(it, rectanglesA, "cornflowerblue", e.offsetX, e.offsetY);
      };
      var oldX = Number.NaN;
      var oldY = Number.NaN;
      mySvg.oncontextmenu = function (e) {
        if (oldX === e.offsetX && oldY === e.offsetY) return;
        oldX = e.offsetX;
        oldY = e.offsetY;
        addRect(rectanglesB, "crimson", e.offsetX, e.offsetY);
        e.preventDefault();
      };
    },
  },
  mounted() {
    let svg = d3.select("svg");
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
