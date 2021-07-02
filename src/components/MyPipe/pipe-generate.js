'use strict';

class PipeGenerater{
    constructor(){
        this._x0 = this._y0 = // start of current subpath
        this._x1 = this._y1 = null; // end of current subpath
        this._ = "";//path str
    }

    /*
     * 弯曲函数，生成两点之间的贝塞尔曲线
     * a:a点的坐标{x:10,y:10}
     * b:b点的坐标{x:10,y:20}
     * curv:弯曲程度 取值 -5 到 5 
     */
    generateCurv(a,b,curv,left){
       curv = curv ? curv : 0;
       let s, k2, controX, controY, q, l, path = '';
       s = 'M' + a.x + ',' + a.y + ' ';
   
        /*
         * 控制点必须在line的中垂线上
         * **求出k2的中垂线(中垂线公式)**
         */
        let x1=a.x,x2=b.x,y1=a.y,y2=b.y;
        k2 = -(x2 - x1) / (y2 - y1);
        /*
         * 弯曲程度是根据中垂线斜率决定固定控制点的X坐标或者Y坐标,通过中垂线公式求出另一个坐标
         * 默认A/B中点的坐标+curv*30,可以通过改基数30改变传入的参数范围
         */
        if(left) {
            controX = (x2 + x1) / 2 - curv * 10;
            //controX = controX < 0 ? -controX : controX;
            controY = k2 * (controX - (x1 + x2) / 2) + (y1 + y2) / 2;
            controY = controY < 0 ? -controY : controY;
        } else {
            controX = (x2 + x1) / 2 + curv * 5;
            //controX = controX < 0 ? -controX : controX;
            controY = k2 * (controX - (x1 + x2) / 2) + (y1 + y2) / 2;
            controY = controY < 0 ? -controY : controY;
        }
        //定义控制点的位置
        q = ' Q' + controX + ',' + controY + ' ';
        //l=lineto
        l = x2 + ',' + y2 + ' ';
        //结果例: M10,10Q35,15,10,20 
   
        //path = s + q + l;
        path =q + l;
        return path;
    }

    generateAnchorPoints(point1,point2,startWidth,alpha){
        let pow = Math.pow;
        let x1=point1.x, y1=point1.y, x2=point2.x, y2=point2.y;
        //(m,n)代表点A到点B的向量,m2代表m的平方
        let m2=pow(x2-x1,2), n2=Math.pow(y2-y1,2);
        //d代表AB点的距离
        let d = pow(m2+n2,0.5);
        let endWidth = startWidth - d*alpha;
        console.log(alpha)
        let xA,xB,xC,xD,yA,yB,yC,yD;
        xA = x2 - (pow(n2,0.5)*endWidth)/(2*d);
        yA = y2 + (pow(m2,0.5)*endWidth)/(2*d);
        xB = x1 - (pow(n2,0.5)*startWidth)/(2*d);
        yB = y1 + (pow(m2,0.5)*startWidth)/(2*d);
        xC = x1 + (pow(n2,0.5)*startWidth)/(2*d);
        yC = y1 - (pow(m2,0.5)*startWidth)/(2*d);
        xD = x2 + (pow(n2,0.5)*endWidth)/(2*d);
        yD = y2 - (pow(m2,0.5)*endWidth)/(2*d);
  
        let result = [{"x":xA,"y":yA}, {"x":xB,"y":yB}, {"x":xC,"y":yC},{"x":xD,"y":yD}]
        return result;
    }
    generateLine(array){
        let line = "M"+array[0][0] + "," +array[0][1]+" "
        for (let i = 1; i < array.length; i++) {
            line += "L" + array[i][0] + "," +array[i][1]+" "
        }
        return line;
    }

    /**
     * 使用d3select的defs添加颜色
     * @param {*} defs 
     * @param {*} direction 
     * @param {颜色数组} color 
     * @param {*} id 
     */
    colourDefs(defs, direction, color, id) {
        var linearGradient = defs
          .append("linearGradient")
          .attr("id", "linear-gradient")
          .attr("id", id);
        linearGradient
          .attr("x1", 0)
          .attr("y1", 0)
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
      }
}


export default new PipeGenerater();