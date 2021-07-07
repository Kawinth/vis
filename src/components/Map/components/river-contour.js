import {
    BubbleSet,
    PointPath,
    ShapeSimplifier,
    BSplineShapeGenerator,
} from "./bubblesets.js";
import * as d3 from 'd3';

class RiverContour {
    constructor(width,height) {
        this.i = 0;
        this.colors = ["black", "yellow", "green", "red"];
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('id',"river-contour");
        svg.setAttribute('xmlns', "http://www.w3.org/2000/svg");
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttribute('viewBox', "0 0 "+width+" "+height);
        svg.setAttribute('style',"background:rgba(135,206,235,0.3);");
        this.svgElement = svg;
        this.bubbles = new BubbleSet();
        this.anchors = [];
        var mySvg = this.svgElement;
        this.items = this.appendSVG(mySvg, "g");
        this.pathA = this.appendSVG(mySvg, "path");
        this.rectanglesA = [];
        this.rectanglesB = [];
    }
    drawCoodinateAxis() {

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
    }
    drawBubble(point){
        
        //this.pathB = this.appendSVG(mySvg, "path");
        d3.selectAll("circle").remove();
        this.addRect(this.rectanglesA, "cornflowerblue", point.x, point.y);
    }
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
    }
    style(elem, style) {
        for (let key in style) {
            let value = style[key];
            if (value === null) {
                delete elem.style.removeProperty(key);
            } else {
                elem.style.setProperty(key, value);
            }
        }
    }
    appendSVG(parent, name) {
        return parent.appendChild(
            document.createElementNS("http://www.w3.org/2000/svg", name)
        );
    }
    removeAllChilds(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
    
    update() {
        this.updateOutline(this.rectanglesA, [], "crimson", this.pathA);
        //console.log(mySvg);
        // updateOutline(rectanglesB, rectanglesA, "cornflowerblue", pathB);
        //console.log(mySvg);
    }

    updateOutline(rectangles, otherRectangles, color, path) {
        var pad = 0;
        //console.log(BubbleSet.addPadding(rectangles, pad))
        var list = this.bubbles.createOutline(
            BubbleSet.addPadding(rectangles, pad),
            BubbleSet.addPadding(otherRectangles, pad),
            null /* lines */
        );


        //console.log(list.toString())
        // let svg = d3.select("#svg");
        // for (var i in list) {
        //     svg.append("circle").attr("cx", list[i][0]).attr("cy", list[i][1]).attr("r", 2).attr("fill", this.colors[this.i])
        // }
        // this.i++;

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
        this.attr(path, {
            d: outline,
            opacity: 0.5,
            fill: color,
            stroke: "black",
        });
        if (this.bubbles.debug() && path === debugFor) {
            this.removeAllChilds(debug);
            this.bubbles.debugPotentialArea().forEach(function (r) {
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

    addRect(rectangles, color, cx, cy) {
        //console.log(rectangles);
        var width = 2;
        var height = 2;
        var x = cx - width * 0.5;
        var y = cy - height * 0.5;
        var elem = this.appendSVG(this.items, "rect");
        this.attr(elem, {
            x: x,
            y: y,
            width: width,
            height: height,
        });
        this.style(elem, {
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
       this.update();
    }
    addAnchor() {}
}

export {RiverContour};
