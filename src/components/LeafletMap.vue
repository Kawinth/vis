<template>
  <div>
    <div id="map"></div>
    <bs style="z-index:999;"></bs>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import 'leaflet.pm'
import 'leaflet.pm/dist/leaflet.pm.css'
import axios from 'axios'
import bs from '@/components/BubbleSets/index'
export default {
  name: 'LMap',
  components:{bs},
  data(){
      return{
          map:null,
          tileLayer:null,
          centralPoint:[29.872129394702633,118.40728144439699],//纬度，经度
          point2:{lng:118.40728144439699,lat:29.872129394702633},
          points:[[29.861057742075726,118.41534952911378],
                  [29.861243830421635,118.41616492065431],
                  [29.86180209337699,118.41762404235841],
                  [29.860164513186504,118.41599325927736],
                  [29.86076000000125,118.4165940740967],
                  [29.861094959773034,118.41745238098146]  
                ],
      }
  },
  methods:{
    onMapClick: function (e) {
    console.log("You clicked the map at " + e.latlng);
}
  },
  mounted(){
      this.map = L.map('map',{
        center: this.point2, // 地图中心
        zoom: 14,   //缩放比列
        zoomControl: false, //禁用 + - 按钮
        doubleClickZoom: false,  // 禁用双击放大
        attributionControl: false,  // 移除右下角leaflet标识
      });

      let name = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
      ).addTo(this.map);
//   this.map.removeLayer(name)  // 移除图层


      var myIcon = L.icon({
          iconUrl: './img/leaf-green.png',
          shadowUrl: './img/leaf-shadow.png',

          iconSize:     [38, 95], // size of the icon
          shadowSize:   [50, 64], // size of the shadow
          iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
          shadowAnchor: [4, 62],  // the same for the shadow
          popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
      });
      L.marker(this.point2, {icon: myIcon}).addTo(this.map);

      var myIcon1 = L.icon({
          iconUrl: './img/blue.png',
          iconSize: [20,20],
          iconAnchor: [10,20]
          });
      let marker1 = L.marker(this.points[5], {icon:myIcon1}).addTo(this.map);

      marker1.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
      var p1 = L.point(10, 10),
          p2 = L.point(40, 60),
          bounds = L.bounds(p1, p2);
      //console.log(this.map)


      var circle = L.circle(this.points[2], {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.5,
          radius: 500
      }).addTo(this.map);
      circle.bindPopup("I am a circle.");
      var polygon = L.polygon(this.points).addTo(this.map);

      this.map.on('click', this.onMapClick);
      axios.get('./map.geojson').then( (res) => {
        L.geoJSON(res.data).addTo(this.map);
        //console.log(res)
      })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map {
  width: 100%;
  height: calc(90vh);
  z-index: 1;
}
</style>
