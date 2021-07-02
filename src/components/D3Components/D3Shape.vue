<template>
  <div id="hello" class="myClass">
      
  </div>
</template>

<script>
import * as d3 from 'd3';

export default{
  name:'d3-shape',
  data(){
      return {
          data:[1,2,3,4]
      }
  },
  mounted(){
    // 数据
			var data = [{
				date: new Date(2019, 3, 24),
				value: 23.24
			}, {
				date: new Date(2019, 3, 25),
				value: 72.15
			}, {
				date: new Date(2019, 3, 26),
				value: 38.84
			}, {
				date: new Date(2019, 3, 27),
				value: 58.62
			}, {
				date: new Date(2019, 3, 30),
				value: 10.80
			}, {
				date: new Date(2019, 4, 1),
				value: 85.47
			}];
			var width = 800,
				height = 400,
				padding = {
					top: 40,
					right: 40,
					bottom: 40,
					left: 40
				};
				
			var colors = d3.schemeSet2;
			var svg = d3.select("#hello")
				.append('svg')
				.attr('width', width + 'px')
				.attr('height', height + 'px');
				
			// x轴:时间轴
			var xScale = d3.scaleTime()
				.domain(d3.extent(data, function(d) {
					return d.date;
				}))
				.range([padding.left, width - padding.right]);
				
			var xAxis = d3.axisBottom()
				.scale(xScale)
				.tickSize(10);
				
			svg.append('g')
				.call(xAxis)
				.attr("transform", "translate(0," + (height - padding.bottom) + ")")
				.selectAll("text")
				.attr("font-size", "10px")
				.attr("dx", "50px");

			var ymax = d3.max(data, function(d) {
				return d.value;
			});

			// y轴
			var yScale = d3.scaleLinear()
				.domain([0, ymax])
				.range([height - padding.bottom, padding.top]);
				
			var yAxis = d3.axisLeft()
				.scale(yScale)
				.ticks(10);
				
			svg.append('g')
				.call(yAxis)
				.attr("transform", "translate(" + padding.left + ",0)");
				
			var curveLine = d3.line()
				.x(function(d) {
					return xScale(d.date);
				})
				.y(function(d) {
					return yScale(d.value);
				})
				.curve(d3.curveCatmullRom.alpha(0.5));
				
            //曲线
			svg.append("path")
				.datum(data)
				.attr("fill", "none")
				.attr("stroke", "steelblue")
				.attr("stroke-width", 1.5)
				.attr("stroke-linejoin", "round")
				.attr("stroke-linecap", "round")
				.attr("d", curveLine);

                // 水平阈值
			svg.append('line')
				.attr('x1', 0)
				.attr('y1', yScale(45))
				.attr('x2', width)
				.attr('y2', yScale(45))
				.attr('stroke', '#FFA354')
				.attr('stroke-width', 1.5)
				.attr('stroke-dasharray', '6,4');

            // 添加一个clipPath 剪切路径
            svg.append("clipPath")
				.attr("id", "clip-th")
				.append("rect")
				.attr("x", 0)
				.attr("y", padding.top)
				.attr("width", width)
				.attr("height", yScale(45) - yScale(ymax));

            // 再次添加一条曲线并填充区域            
            svg.append("path")
				.datum(data)
				.attr("fill", "steelblue")
				.attr("fill-opacity", 0.5)
				.attr("stroke", "none")
				.attr("d", curveLine)
				.attr('clip-path', "url(#clip-th)");
  }
}
</script>


<style scoped>
.myClass {
    background: rgb(234, 234, 238);
}
</style>