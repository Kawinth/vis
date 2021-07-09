<template>
  <div>
    <div id="map"></div>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import "leaflet.chinatmsproviders";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import Info from "../OperationPanel/PipelineInfoEditWindow";
import {mapMutations, mapState} from "vuex";
import "./components/heat-line.js";
import { RiverContour } from "./components/river-contour";

import {
  getList,
  getMarkerList,
  deleteMarker,
  updateMarker,
  deletePipe,
  updatePipe,
} from "@/api/pipe-network";

export default {
  name: "LMap",
  components: { Info },
  data() {
    return {
      map: null,
      formTemp: null,
      centralPoint: [30.13898, 118.170372], //纬度，经度
      layerGroup: [],
      centerP: { lng: 118.170372, lat: 30.13898 },
      editingMarker: {},
      markers: [],
      pipes: [],
      updatedLayers: new Set(),
      geomanTempGroup: L.featureGroup(),
    };
  },

  computed: {
    ...mapState({
      mode: (state) => state.map.mode,
      //pipeList: (state) => state.map.pipeList,
      infoVisible: (state) => state.map.infoVisible,
      serverChanged: (state) => state.map.serverChanged,
      heatLineNodes: (state) => state.map.focusHeatLineNodes,
    }),
  },
  watch: {
    //watch里不能使用箭头函数
    mode: function (newV, oldV) {
      if (newV === "modification") {
        this.initGeoman(this.map);
      } else {
        this.map.pm.removeControls();
      }
    },
    serverChanged: function (newV, oldV) {
      console.log(
        "%c[SUCCESS]",
        "color: white; background: green;",
        " 服务端状态改变了"
      );
      this.drawHeatLine();
      this.flushData();
      //TODO 是否清空
    },
  },
  methods: {
    ...mapMutations({
      // 将 `this.setPipelineInfoVisible()` 映射为 `this.$store.commit('view/commitPipeLineInfoEditVisible')`
      setPipelineInfoVisible: 'view/commitPipeLineInfoEditVisible',
      setEditingPipeline: 'view/commitPipeLineInfo',
      setMarkerInfoVisible: 'view/commitMarkerInfoEditVisible',
      setEditingMarker: 'view/commitMarkerInfo',
      changeServerStatus: 'map/SET_SERVER_CHANGED',
    }),
    async flushData() {
      this.layerGroup.clearLayers();
      await getMarkerList(null).then((res) => (this.markers = res.data));
      await getList(null).then((res) => (this.pipes = res.data));
      let myIcon = this.changeGeomanDefaultIcon(this.map);
      //绘制管线
      for (let i in this.pipes) {
        let line;
        try {
          line = L.polyline(this.pipes[i].nodes, {
            color: this.pipes[i].lineColor,
            weight: this.pipes[i].lineWeight,
          }).addTo(this.layerGroup);
        } catch (e) {
          console.log(e);
          console.log(
            "%c[Failed]",
            "color: white; background: red;",
            this.pipes[i].name + "管线数据有误"
          );
          continue;
        }

        line.bindTooltip(this.pipes[i].name, {
          interactive: true,
          sticky: true,
        });
        line.id = this.pipes[i].id;
        line.isPipe = true;
      }
      //绘制marker
      for (let i in this.markers) {
        let marker = L.marker(
          [this.markers[i].latitude, this.markers[i].longitude],
          { icon: myIcon }
        )
          .addTo(this.layerGroup)
          .bindPopup(
            '<span style="color:blue; ">' + this.markers[i].name + "</span>",
            { className: "mypopup" }
          );
        marker.id = this.markers[i].id;
        marker.isPipe = false;
      }

      for (let key in this.layerGroup._layers) {
        this.layerGroup._layers[key].on("pm:edit", (e) => {
          this.updatedLayers.add(key);
        });
      }
    },
    drawHeatLine() {
      let heatLineLayer = L.heatLine(this.heatLineNodes.node, {
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
        extraValue: this.heatLineNodes.weight,
      });
      //let bounds = heatLineLayer.getBounds();
      //自动缩放到最佳比例
      //this.map.fitBounds(bounds);
      heatLineLayer
        .bindPopup((e) => {
          console.log(e);
          return "HHHHHHH";
        })
        .addTo(this.map);
      this.drawContour();
    },
    drawContour() {
      let anchors = this.heatLineNodes.anchor;
      console.log(this.heatLineNodes);
      //let zoomIndex = this.map._zoom;
      let mapSize = this.map.getPixelBounds().getSize();
      let myBubble = new RiverContour(mapSize.x.toString(), mapSize.y.toString());
      //let crs = this.map.options.crs;
      let points = []
      let nodes = []
      let l = []
      let l2 = []
      for(let node of this.heatLineNodes.node){
        let nodeTemp = L.latLng(node);
        let point = this.map.latLngToLayerPoint(nodeTemp);
        nodes.push(point)
        //l.push(nodeTemp)
      }
      for (let anchor of anchors) {
        let latLng = L.latLng(anchor);
        let point = this.map.latLngToLayerPoint(latLng);
        l2.push(latLng);
        //points.push(point)*/
      
    
        //myBubble.drawBubble(point);
      }
      console.log(l2[0]);
      myBubble.drawBubble(nodes[0]);
      myBubble.drawBubble(nodes[nodes.length-1]);
      /*for(let latLng of l) {
        L.circle(latLng, {
          color: "red",
          fillColor: "#f03",
          fillOpacity: 0.5,
          radius: 10,
        }).addTo(this.map);
      }
      for(let latLng of l2) {
        L.circle(latLng, {
          color: "red",
          fillColor: "#f03",
          fillOpacity: 0.5,
          radius: 10,
        }).addTo(this.map);
      }*/
      

      L.svgOverlay(myBubble.svgElement, this.map.getBounds()).addTo(this.map);
    },
    
    /**
     * 使用闭包避免获取不到Vue组件的上下文
     */
    batchUpdate() {
      return (e) => {
        if (e.enabled === true) {
          //geoman进入edit模式后
          this.updatedLayers = new Set();
        } else {
          //退出edit模式或进入其他模式
          for (let key of this.updatedLayers.keys()) {
            let updated = this.layerGroup._layers[key];
            if (updated.isPipe === true) {
              let pipe = this.findPipe(updated.id);
              pipe.nodes = [];

              for (let i in updated._latlngs) {
                //转换为后台所需格式
                pipe.nodes.push([
                  updated._latlngs[i].lat,
                  updated._latlngs[i].lng,
                ]);
              }
              updatePipe(pipe).then(() => {
                this.changeServerStatus();
              });
            } else {
              let marker = this.findMarker(updated.id);
              console.log(updated);
              marker.longitude = updated._latlng.lng;
              marker.latitude = updated._latlng.lat;
              updateMarker(marker).then(() => {
                this.changeServerStatus();
              });
            }
          }
        }
      };
    },
    onLayerRemove() {
      return (e) => {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            if (e.shape === "Marker") {
              deleteMarker(e.layer.id);
            }
            if (e.shape === "Line") {
              deletePipe(e.layer.id);
            }
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
            this.flushData();
          });
      };
    },
    onLayerCreated() {
      console.log(this.layerGroup)

      return (e) => {
        console.log(this.geomanTempGroup)
        if (e.shape === "Marker") {
          this.editingMarker = {
            id: null,
            name: "",
            latitude: e.marker._latlng.lat,
            longitude: e.marker._latlng.lng,
            altitude: null,
            equipmentId: null,
          };
          this.setEditingMarker(this.editingMarker);
          this.setMarkerInfoVisible(true);
        }

        if (e.shape === "Line") {
          //添加线后，打开信息编辑窗口，保存入库
          this.formTemp = {
            id: null,
            flow: 1000.0,
            frictionCoefficient: 0.1,
            hydraulicPressure: 0.28,
            lineColor: "#993333",
            groupNumber: 1,
            lineWeight: 2,
            diameter: 300,
            direction: 1,
            length: null,
            manufacturer: "",
            name: "",
            nodes: null,
            texture: "",
          };
          this.setEditingPipeline(this.formTemp);
          //将捕捉到的layer里的经纬度数组转换为对应格式
          let arr = [];
          for (let i = 0; i < e.layer._latlngs.length; i++) {
            arr.push([e.layer._latlngs[i].lat, e.layer._latlngs[i].lng]);
          }
          this.formTemp.nodes = arr;
          // console.log(e);
          this.setPipelineInfoVisible(true);
        }
      };
    },

    findPipe(id) {
      for (let i in this.pipes) {
        if (this.pipes[i].id == id) {
          return this.pipes[i];
        }
      }
    },
    findMarker(id) {
      for (let i in this.markers) {
        if (this.markers[i].id == id) {
          return this.markers[i];
        }
      }
    },
    exitDrawMode() {
      return (e) => {
        if (e.enabled === false && e.shape === "Marker") {
          this.flushData();
        }
      };
    },
    /**
     * 注：Geoman插件默认的Marker图标加载不了，需要修改
     * 本方法更改默认的Icon
     */
    changeGeomanDefaultIcon(map) {
      let markerIcon = require("@/assets/image/水厂.png");
      let markerIcon2x = require("@/assets/image/水厂-2x.png");
      let markerShadow = require("@/assets/image/marker-shadow.png");
      let DefaultIcon = L.icon({
        iconUrl: markerIcon,
        iconRetinaUrl: markerIcon2x,
        shadowUrl: markerShadow,
        iconSize: [23, 24],
        iconAnchor: [11, 24],
        popupAnchor: [2, -28],
        tooltipAnchor: [0, -24],
        shadowSize: [30, 30],
        shadowAnchor: [8, 30],
      });
      //改变leaflet默认图标
      L.Marker.prototype.options.icon = DefaultIcon;

      let markerStyle = { icon: DefaultIcon };
      //改变geoman默认图标
      map.pm.setGlobalOptions({ markerStyle: markerStyle });
      return DefaultIcon;
    },
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
            Map: "https://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=8ac4041d5674349dab32efedfd36082a",
            Annotion:
              "https://t{s}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=8ac4041d5674349dab32efedfd36082a",
          },
          Satellite: {
            Map: "https://t{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=8ac4041d5674349dab32efedfd36082a",
            Annotion:
              "https://t{s}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=8ac4041d5674349dab32efedfd36082a",
          },
          Terrain: {
            Map: "https://t{s}.tianditu.gov.cn/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=8ac4041d5674349dab32efedfd36082a",
            Annotion:
              "https://t{s}.tianditu.gov.cn/cta_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=8ac4041d5674349dab32efedfd36082a",
          },
          Subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
        },
      };
    },
    loadMap() {
      let map = L.map("map", {
        center: this.centerP, // 地图中心
        zoom: 13, //缩放比列
        zoomControl: false, //禁用 + - 按钮
        doubleClickZoom: false, // 禁用双击放大
        attributionControl: false, // 移除右下角leaflet标识
      });

      let normalm = L.tileLayer.chinaProvider("TianDiTu.Normal.Map", {
          maxZoom: 18,
          minZoom: 5,
          //tileSize: 512,
        }),
        normala = L.tileLayer.chinaProvider("TianDiTu.Normal.Annotion", {
          maxZoom: 18,
          minZoom: 5,
          //tileSize: 512,
        }),
        imgm = L.tileLayer.chinaProvider("TianDiTu.Satellite.Map", {
          maxZoom: 18,
          minZoom: 5,
          //tileSize: 512,
        }),
        imga = L.tileLayer.chinaProvider("TianDiTu.Satellite.Annotion", {
          maxZoom: 18,
          minZoom: 5,
          //tileSize: 512,
        });
      let OpenStreetMap_Mapnik = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 19,
          //tileSize: 512,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      );
      let normal = L.layerGroup([normalm, normala]),
        image = L.layerGroup([imgm, imga]);
      normal.addTo(map);
      let baseLayers = {
        地图: normal,
        OSM: OpenStreetMap_Mapnik,
        影像: image,
      };

      let overlayLayers = {};

      L.control.layers(baseLayers, overlayLayers).addTo(map);
      L.control
        .zoom({
          zoomInTitle: "放大",
          zoomOutTitle: "缩小",
          position: "topright",
        })
        .addTo(map);

      //   this.map.removeLayer(normal)  // 移除图层
      this.layerGroup = L.featureGroup()
        .on("click", this.clickLayer)
        .addTo(map); //添加featureGroup统一管理交互
      this.layerGroup.on("mouseover", this.mouseoverLine);
      this.layerGroup.on("mouseout", this.mouseoutLine);
      //map.on("click",(e)=>{console.log(e)});
      return map;
    },
    mouseoverLine: function (e) {
      if (e.propagatedFrom.isPipe === true) {
        let selectedPipe = this.findPipe(e.layer.id);
        e.layer.setStyle({
          weight: selectedPipe.lineWeight + 3,
        });
      }
    },
    mouseoutLine: function (e) {
      if (e.propagatedFrom.isPipe === true) {
        let selectedPipe = this.findPipe(e.layer.id);

        e.layer.setStyle({
          weight: selectedPipe.lineWeight,
        });
      }
    },
    clickLayer: function (e) {
      if (this.mode === "normal") {
        return;
      }
      if (e.propagatedFrom.isPipe === true) {
        console.log(e)
        //若已经打开了编辑窗口，先关闭其他的窗口
        this.setPipelineInfoVisible(false);
        let layer = e.layer;
        console.log(layer);
        layer.setStyle({
          weight: 5,
          dashArray: "",
          color: "#666",
          fillOpacity: 0.7,
        });
        this.formTemp = this.findPipe(layer.id);
        this.setEditingPipeline(this.formTemp);
        this.setPipelineInfoVisible(true);
      } else {
        this.editingMarker = this.findMarker(e.layer.id);
        this.setEditingMarker(this.editingMarker);
        this.setMarkerInfoVisible(true);
      }
    },
    initGeoman(map) {
      //L.PM.setOptIn(true);
      this.changeGeomanDefaultIcon(map);
      map.pm.setLang("zh");
      map.pm.setGlobalOptions({ layerGroup: this.layerGroup });
      // add leaflet-geoman controls with some options to the map
      map.pm.setPathOptions({
        //组件绘制的颜色
        color: "blue",
        weight: 2,
        fillColor: "#FF6666",
        fillOpacity: 0.4,
      });
      map.pm.addControls({
        position: "topleft",
        drawCircleMarker: false,
        drawRectangle: false,
        drawCircle: false,
        drawPolygon: false,
        cutPolygon: false,
      });

      map.on("pm:create", this.onLayerCreated());
      //map.on("pm:drawend", this.onLayerCreated2());
      map.on("pm:globaldrawmodetoggled", this.exitDrawMode());
      map.on("pm:globaleditmodetoggled", this.batchUpdate());
      map.on("pm:globaldragmodetoggled", this.batchUpdate());
      map.on("pm:remove", this.onLayerRemove());
    },
  },
  mounted() {
    this.changeTianDiTuKey();
    this.map = this.loadMap();
    this.flushData();
    this.$store.commit("map/SET_LEAFLET_MAP",this.map);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cd-span {
  color: seagreen;
}
#map {
  width: 100%;
  height: 100%;
}
</style>
