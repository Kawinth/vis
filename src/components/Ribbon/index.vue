<template>
  <section>
    <div id="map"></div>
    <aside>
      <label>
        <span>Weight - </span>
        1 <input id="weight" type="range" min="1" max="16" value="5" /> 16
      </label>
      <br />
      <label>
        <span>Outline width - </span>
        0 <input id="outlineWidth" type="range" min="0" max="8" value="1" /> 8
      </label>
      <label>
        <span>Outline color</span>
        <input id="outlineColor" type="color" value="#000000" />
      </label>
      <br />
      <label>
        <span>Min - </span>
        100
        <input
          id="min"
          type="range"
          min="100"
          max="250"
          value="150"
          steps="5"
        />
        250
      </label>
      <label>
        <span>Max - </span>
        250
        <input
          id="max"
          type="range"
          min="250"
          max="500"
          value="350"
          steps="5"
        />
        500
      </label>
      <label>
        <span>Palette color 1</span>
        <input id="paletteColor1" type="color" value="#008800" />
      </label>
      <label>
        <span>Palette color 2</span>
        <input id="paletteColor2" type="color" value="#ffff00" />
      </label>
      <label>
        <span>Palette color 3</span>
        <input id="paletteColor3" type="color" value="#ff0000" />
      </label>
      <label>
        <span>Smooth factor - </span>
        0 <input type="range" id="smoothFactor" value="1" min="0" max="10" /> 10
      </label>
    </aside>
  </section>
</template>

<script>
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import "leaflet.chinatmsproviders";
import data from "./data/coords.js";
import {pipe1} from "./data/data.js"
import "./coponents/heat-line";
import data2 from "./data/test.js"
import {addHeatLine} from "@/api/heat-line";

export default {
  name: "RibbonPipe",
  data() {
    return {
      map: null,
      centerP: {lng:118.40728144439699,lat:29.872129394702633},
      centerP2: { lng: 118.170372, lat: 30.13898 },
    }
  },
  methods: {
    /**
     * 注：2019年1月1日起天地图API及服务接口调用都需要获得开发授权,需要申请Key
     * 本方法更改默认的key
     */
    changeTianDiTuKey() {
      L.TileLayer.ChinaProvider = L.TileLayer.extend({
        initialize: function (type, options) {
          // (type, Object)
          var providers = L.TileLayer.ChinaProvider.providers;

          var parts = type.split(".");

          var providerName = parts[0];
          var mapName = parts[1];
          var mapType = parts[2];

          var url = providers[providerName][mapName][mapType];
          options.subdomains = providers[providerName].Subdomains;

          L.TileLayer.prototype.initialize.call(this, url, options);
        },
      });
      L.TileLayer.ChinaProvider.providers = {
        TianDiTu: {
          Normal: {
            Map:
              "https://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=8ac4041d5674349dab32efedfd36082a",
            Annotion:
              "https://t{s}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=8ac4041d5674349dab32efedfd36082a",
          },
          Satellite: {
            Map:
              "https://t{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=8ac4041d5674349dab32efedfd36082a",
            Annotion:
              "https://t{s}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=8ac4041d5674349dab32efedfd36082a",
          },
          Terrain: {
            Map:
              "https://t{s}.tianditu.gov.cn/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=8ac4041d5674349dab32efedfd36082a",
            Annotion:
              "https://t{s}.tianditu.gov.cn/cta_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=8ac4041d5674349dab32efedfd36082a",
          },
          Subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
        },
      };
    },
    loadMap() {
      var map = L.map("map", {
        center: this.centerP2, // 地图中心
        zoom: 13, //缩放比列
        zoomControl: false, //禁用 + - 按钮
        doubleClickZoom: false, // 禁用双击放大
        attributionControl: false, // 移除右下角leaflet标识
      });

      var normalm = L.tileLayer.chinaProvider("TianDiTu.Normal.Map", {
          maxZoom: 18,
          minZoom: 5,
        }),
        normala = L.tileLayer.chinaProvider("TianDiTu.Normal.Annotion", {
          maxZoom: 18,
          minZoom: 5,
        }),
        imgm = L.tileLayer.chinaProvider("TianDiTu.Satellite.Map", {
          maxZoom: 18,
          minZoom: 5,
        }),
        imga = L.tileLayer.chinaProvider("TianDiTu.Satellite.Annotion", {
          maxZoom: 18,
          minZoom: 5,
        });
      var OpenStreetMap_Mapnik = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      );
      var normal = L.layerGroup([normalm, normala]),
        image = L.layerGroup([imgm, imga]);
      normal.addTo(map);
      var baseLayers = {
        天地图: normal,
        OSM: OpenStreetMap_Mapnik,
        影像: image,
      };

      var overlayLayers = {};

      L.control.layers(baseLayers, overlayLayers).addTo(map);
      L.control
        .zoom({
          zoomInTitle: "放大",
          zoomOutTitle: "缩小",
        })
        .addTo(map);

      //   this.map.removeLayer(normal)  // 移除图层
      this.layerGroup = L.featureGroup()
        .on("click", this.clickLayer)
        .addTo(map); //添加featureGroup统一管理交互
      this.layerGroup.on("mouseover", this.mouseoverLine);
      this.layerGroup.on("mouseout", this.mouseoutLine);
      return map;
    },
    drawHotline2(){
      let l2 = pipe1.length;
      for (let i = 0;i<l2;i++){
        pipe1[i].push(170+Math.round(Math.random()*i));
      }
      let heatLineLayer = L.heatLine(pipe1, {
        min: 100,
        max: 250,
        palette: {
          0.0: "#008800",
          0.5: "#ffff00",
          1.0: "#ff0000",
        },
        weight: 5,
        outlineColor: "#000000",
        outlineWidth: 1,
      });

      // let bounds1 = heatLineLayer.getBounds();
      //
      // this.map.fitBounds(bounds1);
      heatLineLayer
        .bindPopup("Thanks for clicking.<br/>Play with me!")
        .addTo(this.map);
    },
    drawHotline() {
      let length = data2.length;

      for (let i = 0;i<length;i++){
        data2[i].push(200+Math.round(Math.random()*i));
      }
      var heatLineLayer = L.heatLine(data2, {
        min: 150,
        max: 350,
        palette: {
          0.0: "#008800",
          0.5: "#ffff00",
          1.0: "#ff0000",
        },
        weight: 5,
        outlineColor: "#000000",
        outlineWidth: 1,
      });

      var bounds = heatLineLayer.getBounds();
      this.map.fitBounds(bounds);
      heatLineLayer
        .bindPopup("Thanks for clicking.<br/>Play with me!")
        .addTo(this.map);

      ["weight", "outlineWidth", "min", "max", "smoothFactor"].forEach(
        function (value) {
          document.getElementById(value).addEventListener("input", function () {
            var style = {};
            style[value] = parseInt(this.value, 10);
            heatLineLayer.setStyle(style).redraw();
          });
        }
      );

      document
        .getElementById("outlineColor")
        .addEventListener("input", function () {
          heatLineLayer.setStyle({ outlineColor: this.value }).redraw();
        });

      var paletteColor1 = document.getElementById("paletteColor1");
      var paletteColor2 = document.getElementById("paletteColor2");
      var paletteColor3 = document.getElementById("paletteColor3");
      [paletteColor1, paletteColor2, paletteColor3].forEach(function (element) {
        element.addEventListener("input", updatePalette);
      });
      function updatePalette() {
        heatLineLayer
          .setStyle({
            palette: {
              0.0: paletteColor1.value,
              0.5: paletteColor2.value,
              1.0: paletteColor3.value,
            },
          })
          .redraw();
      }
    },
    drawHotline3(){
      addHeatLine()
      let length = data2.length;

      for (let i = 0;i<length;i++){
        data2[i].push(200+Math.round(Math.random()*i));
      }
      var heatLineLayer = L.heatLine(data2, {
        min: 150,
        max: 350,
        palette: {
          0.0: "#008800",
          0.5: "#ffff00",
          1.0: "#ff0000",
        },
        weight: 5,
        outlineColor: "#000000",
        outlineWidth: 1,
      });

      var bounds = heatLineLayer.getBounds();
      this.map.fitBounds(bounds);
      heatLineLayer
          .bindPopup("Thanks for clicking.<br/>Play with me!")
          .addTo(this.map);

      ["weight", "outlineWidth", "min", "max", "smoothFactor"].forEach(
          function (value) {
            document.getElementById(value).addEventListener("input", function () {
              var style = {};
              style[value] = parseInt(this.value, 10);
              heatLineLayer.setStyle(style).redraw();
            });
          }
      );

      document
          .getElementById("outlineColor")
          .addEventListener("input", function () {
            heatLineLayer.setStyle({ outlineColor: this.value }).redraw();
          });

      var paletteColor1 = document.getElementById("paletteColor1");
      var paletteColor2 = document.getElementById("paletteColor2");
      var paletteColor3 = document.getElementById("paletteColor3");
      [paletteColor1, paletteColor2, paletteColor3].forEach(function (element) {
        element.addEventListener("input", updatePalette);
      });
      function updatePalette() {
        heatLineLayer
            .setStyle({
              palette: {
                0.0: paletteColor1.value,
                0.5: paletteColor2.value,
                1.0: paletteColor3.value,
              },
            })
            .redraw();
      }
    },
    test(){
      var latlng = L.latLng(29.872129394702633,118.40728144439699)
      console.log(latlng.toBounds(200));
    }
  },
  mounted() {
    this.changeTianDiTuKey();
    this.map = this.loadMap();
    this.drawHotline();
    //this.drawHotline2();
    //this.test()
  },
};
</script>

<style scoped>
section {
  max-width: 600px;
  /* margin: 1.5em auto; */
  text-align: center;
}
aside {
  margin: 1.5em 0;
}
label {
  display: inline-block;
  padding: 0.5em;
}
input {
  vertical-align: text-bottom;
}
#map {
  width: 1800px;
  height: 550px;
}
.muted {
  color: #666;
  font-size: 0.8em;
}
</style>
