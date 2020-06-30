<template>
  <div id="app">
    <h3 class="title" style="   padding-bottom: 10px">{{ msg }}</h3>
      
    <div class="amap-wrapper" >
      <!-- <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box> -->
      <el-amap  vid="amap" class="amap-box" :plugin="plugin" :center="center" :zoom="zoom">
        
        <el-amap-marker v-for="marker in markers" vid="aaa" ref="${marker.montpoint}" v-bind:key="marker.montpoint" :content="marker.content" :position="marker.position" :events="marker.events"></el-amap-marker>
        <el-amap-info-window v-if="window" :position="window.position" :visible="window.visible" :content="window.content"></el-amap-info-window>
      </el-amap>
      <div class="search-box">
        <input  class="search-input" type="text" :value="searchtext" :label="searchtext" style="float:left"/>
        <button class="search-button" style="float:right" v-on:click="searchinf">搜索</button>
      </div>

      
      
    </div>
    <div  class="amap-wrapper" v-if="false">
      <el-amap vid="amap-main"> </el-amap>
    </div>
    <button @click="add()">add marker</button>
  </div>
</template>

<script>
localStorage.removeItem('_AMap_raster');
Vue.use(VueAMap);
import {AMapManager} from "vue-amap";
import { lazyAMapApiLoaderInstance } from 'vue-amap';
import axios from 'axios';
import Vue from 'vue';
import VueAMap from 'vue-amap';
let amapManager = new AMapManager();
//let lazyaMapApiLoaderInstance = new lazyAMapApiLoaderInstance();
export default { 
  data () {
    return {
      zoom: 5,
      center: [105.59996, 37.197646],     
      //position:[115.59996, 40.197646],
      index:null,
      markers: [],
      windows: [],
      window: '',
      amapManager,
      searchtext:"",
      msg: '设备位置分布查看！(根据挂载点名称可快速查看)',
                                  // :center="center"  :events="events"
      searchOption: {
            city: '上海',
            citylimit: true
          },
      plugin: [{
          
            pName: 'MapType',
            defaultType: 0,
            events: {
              init(instance) {
                console.log(instance);
              }
            }
          },
          {
             pName: 'Scale',
          },
          {
            pName: 'ToolBar',
            events: {
              init(instance) {
                console.log(instance);
              }
            }
          },
          /*
          {
            pName: 'Geolocation',
            events: {
              init(o) {
                // o 是高德地图定位插件实例
                o.getCurrentPosition((status, result) => {
                  if (result && result.position) {
                    self.lng = result.position.lng;
                    self.lat = result.position.lat;
                    self.center = [self.lng, self.lat];
                    self.loaded = true;
                    self.$nextTick();
                  }
                });
              }
            }
          }*/
          ],
      events: {
            init(o) {             
               let marker = new AMap.Marker({
                position: [126.59996, 31.197646]
              });
              marker.setMap(o);
            }
          }
    }
  },
     mounted() {
       localStorage.removeItem('_AMap_raster');
        Vue.use(VueAMap);
       //localStorage.removeItem('_AMap_raster');
       //Vue.use(VueAMap);
       var that=this;
        //localStorage.removeItem('_AMap_raster');
        /*
        lazyAMapApiLoaderInstance.load().then(() => {
        this.map = new AMap.Map('amap-main', {
        pitch:70,
        viewMode:'3D',
        //features: ['bg', 'road','building'],
        //zoom:17,
        //expandZoomRange:true,
        //zooms:[3,20],
        //position:[118.59996, 31.197646],
        center: new AMap.LngLat(116.59996, 31.197646)
        
        })
        })*/
        //that.showDetails();
        //获取所有基站名及在线状况和经纬度
        axios.get(localStorage.getItem('urls')+"api/Basestation/AllPos/").then(function(res){ 
        var newdata=res.data.results;
        
        console.log(res);
        let markers = [];
        let windows = [];
        let num = 10;
        let self = that;
        for (let i = 0 ; i < newdata.length ; i ++) {     //newdata.length
          that.markers.push({
            moutpoint:newdata.mountpoint,
            position: [newdata[i].Longitude,newdata[i].Latitude],
            content: '',
            events: {
              click() {
                
                self.windows.forEach(window => {
                  window.visible = false;

                });

                self.window = self.windows[i];
                self.$nextTick(() => {
                  self.window.visible = true;
                  //console.log(self.window.content);
                  var con=self.window.content;
                  //var ss=con.slice(20);
                  var ss=con.split('>');
                  var s=ss[1].split('<');
                  //console.log(s[0]);
                  axios.get(localStorage.getItem('urls')+"api/Basestation/"+s[0]).then(function(res){
                      var online=null;
                      var color=null;
                      var result=res.data.results;
                      if(result[0].IsOnline)
                      {
                        online="在线";
                        color="bule"
                        self.window.content=`<div class="prompt" style="font-size:10px;">${ s[0] }</div><div class="prompt" style="font-size:10px;color:green">${ online }</div>`
                      }
                      else
                      {
                        online="未在线"
                        color="red"
                        self.window.content=`<div class="prompt" style="font-size:10px;">${ s[0] }</div><div class="prompt" style="font-size:10px;color:red">${ online }</div>`
                      }
                      //self.window.content=`<div class="prompt" style="font-size:10px;">${ s[0] }</div><div class="prompt" style="'font-size:10px;color:'+(color)">${ online }</div>`
                      //console.log(res.data);
                  }).catch(function(error){
                         // console.log("error.data");
                         
                        });

                });
              }
            }
          });

          windows.push({
            position: [newdata[i].Longitude,newdata[i].Latitude],
            content: `<div class="prompt">${ newdata[i].Mountpoint }</div>`,
            visible: false
          });
        }

        that.markers = markers;
        that.windows = windows;
        }).catch(function(error){
                //console.log("error.data");
              });
      },
    
  // mounted() {
  //   localStorage.removeItem('_AMap_raster');
  //   lazyAMapApiLoaderInstance.load().then(() => {
  //   this.map = new AMap.Map('amap-main', {
  //   pitch:70,
  //   viewMode:'3D',
  //   //features: ['bg', 'road','building'],
  //   //zoom:17,
  //   //expandZoomRange:true,
  //   //zooms:[3,20],
  //   center: new AMap.LngLat(116.59996, 31.197646)

  //   });
   

  methods: {
        add() {
          var map = new AMap.Map('container', {
             pitch:75, // 地图俯仰角度，有效范围 0 度- 83 度
             viewMode:'3D' // 地图模式
          });
          
        },
        searchinf:function(){
          console.log(this.searchtext);
            //var ss=document.getElementById("aaa");
            // var ss=this.$refs["cors_123"];
            // console.log(this.$refs);
            // console.log(ss);
            // console.log(ss[0].position);
            //ss.icon = "../../assets/img/img.jpg";


          var that=this;
          axios.get(localStorage.getItem('urls')+"api/Basestation/"+"Mountpoint6").then(function(res){
            console.log(res);
            var result=res.data.results;
            var online=null;
            var color=null;
            
            if(result[0].IsOnline)
            {
              online="在线";
              color="green";
            }
            else
            {
              online="未在线";
              color="red";
            }
            
            that.center=[result[0].Longitude,result[0].Latitude]
            that.windows.forEach(window => {
                  window.visible = false;
                });
            that.window=that.windows[0];
            that.$nextTick(() => {
              
            that.window.position=[result[0].Longitude,result[0].Latitude],
            that.window.content=`<div class="prompt" style="font-size:10px;">${ result[0].mountpoint }</div><div class="prompt" style="font-size:10px;color:${color}">${ online }</div>`,
            that.window.visible=true
            }).catch(function(error){
                         // console.log("error.data");
                         that.$message.success('搜索失败');
                        });
           

          })
          //this.searchtext=null;
       
         
        //   //console.log(s);
        //    var num=s[0].content;
        //   console.log(s[0].position);
        //   console.log(num);
        //  // this.window=true;
        //   this.window=this.windows[0];
        //   this.window.visible=true;
        //   s[0].events;
        },
        /*
        showDetails:function(){
          //  this.$http.get('http://localhost:5000/').then(function(res){
          //  this.msg = res.body;
          var that=this;
            axios.get("http://localhost:5000/").then(function(res){
              var newdata=res.data;
              console.log(newdata.length);
              let markers = [];
              let windows = [];             
              //let num = 10;         
             // let self = that;
        
              for (var i = 0 ; i < 2 ; i ++) {
                var lon=newdata[i].L;
                var lat=newdata[i].B;
                var name=newdata[i].name;
                console.log(lon);
                console.log("wang");
                markers.push({
                  //moutpoint:i,
                  position: [newdata[i].L,newdata[i].B],
                  events: {
                    click() {
                      that.windows.forEach(window => {
                        //window.visible = false;
                      });
                      that.window = that.windows[i];
                      that.$nextTick(() => {
                        //that.window.visible = true;
                      });
                    }
                  }
                });

                windows.push({
                  position: [117.45,56.345],
                  content: `<div class="prompt">wang${ i }</div>`,
                  visible: true
                });
              }

              that.markers = markers;
              that.windows = windows;
              
              
              //console.log(res.data.Type);

              }).catch(function(error){
                console.log("error.data");
              });
        },*/
        onSearchResult(pois){
          console.log(pois)
        }         
      }
   
}

</script>

<style>
.amap-wrapper {
  width: 100%;
  height: 90%;
  position: relative;
}
.amap-box{
  width: 100%;
  height: 100%;
}
.search-box {
      position: absolute;
      top: 40px;
      left: 80px;
      
    }
.search-input {
     outline:none;
   background-color:white;
       border:1px white  solid;
      height: 40px;
      width: 200px;
      padding-left:15px;
      font-size:18px;
    
}
.search-input:focus {
  outline:none;
  border:1px white  solid;
}
.search-button {
    
       background-color:white;
       border:1px white  solid;
      height: 42px;
      width: 70px;
      font-size:15px;
      cursor:pointer;
}
.search-button:focus {
  outline:none;
  border:1px white  solid;
}

</style>