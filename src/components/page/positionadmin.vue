<template>
  <div id="app">
    <h3 class="title" style="   padding-bottom: 10px">{{ msg }}</h3>
      
    <div class="amap-wrapper" >
      <!-- <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box> -->
      <el-amap  vid="amap" class="amap-box" :plugin="plugin" :center="center" :zoom="zoom" :events="events" :amap-manager="amapManager">
        <!-- :offset="marker.offset"    :icon="marker.icon" -->
        <el-amap-marker v-for="marker in markers" v-show="IsMarker" vid="aaa" ref="${marker.montpoint}" v-bind:key="marker.montpoint"  :content="marker.content"  :position="marker.position" :events="marker.events"></el-amap-marker>
        <el-amap-marker v-for="marker in points" v-show="IsPoint" vid="aaa" ref="${marker.montpoint}" v-bind:key="marker.montpoint" :content="marker.content"  :position="marker.position" :events="marker.events"></el-amap-marker>
        <el-amap-info-window v-if="window" :position="window.position" :visible="window.visible" :content="window.content"></el-amap-info-window>
      </el-amap>
      <div class="search-box">
        <input  class="search-input" type="text" v-model="searchtext" :label="searchtext" style="float:left"/>
        <button class="search-button"  v-on:click="searchinf">搜索</button>
        <button class="search-button" style="float:right" v-on:click="changemap(true)">返回</button>
      </div>

      
      
    </div>
    <div  class="amap-wrapper" v-if="false">
      <el-amap vid="amap-main"> </el-amap>
    </div>
  </div>
</template>

<script>
// localStorage.removeItem('_AMap_raster');
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
     var that=this;
    return {
      zoom: 5,
      center: [105.59996, 37.197646],     
      //position:[115.59996, 40.197646],
      index:null,
      markers: [],
      newamap:null,
      points:[],
      IsMarker:true,
      IsPoint:false,
      windows: [],
      firstdata:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
      position:[],
      count:[],
      Online:[],   //每个省份是否由未在线的
      window: '',
      amapManager,
      searchtext:"",
      pros : ["北京","天津","上海","重庆","河北省","山西省","辽宁省","吉林省","黑龙江省","江苏省","浙江省","安徽省","福建省","江西省","山东省","河南省","湖北省","湖南省","广东省","海南省","四川省","贵州省","云南省","陕西省","甘肃省","青海省","内蒙古","广西","西藏","宁夏","新疆","香港","澳门","台湾"],
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
              that.newamap=o;        //获取地图实例方法1
              // console.log("88");       
              //  let marker = new AMap.Marker({
              //   position: [126.59996, 31.197646]
              // });
              // marker.setMap(o);
            },
            /*
            enterKey(){
              console.log("963");
              this.searchinf();
            }*/
            zoomend(){      //缩放
              console.log(that.newamap.getZoom());
              let o = amapManager.getMap();       //获取地图实例方法2
              console.log("632");
              //console.log(new AMap.Pixel(-13,-60));
              if(o.getZoom()<5)
              {
                if(that.markers==null||that.markers.length==0)
                {
                  that.changemap(false);
                  console.log("444");
                }
                console.log("544");
                
              }
              

              if(o.getZoom()>7)
              {
                if(that.points==null||that.points.length==0)
                {
                  console.log("8888888");
                  var center=that.newamap.getCenter();
                  console.log(center);
                  //var bl=center.split(',');
                  var l=center.lng;
                  var b=center.lat;
                  var area=0;
                  var minindex=0;
                  var minarea=(that.position[0][0]-l)*(that.position[0][0]-l)+(that.position[0][1]-b)*(that.position[0][1]-b);
                  for(var i=1;i<34;i++)
                  {
                    area=(that.position[i][0]-l)*(that.position[i][0]-l)+(that.position[i][1]-b)*(that.position[i][1]-b);
                    if(area<minarea)
                    {
                      minarea=area;
                      minindex=i;
                    }
                  }
                  if(that.count[minindex]==0)
                  { }
                  else
                  {
                    that.markers=null;
                    that.showDetails(minindex,false);
                  }

                }
            
              }
            },
            // moveend(){  移动
            // }
             
          }
    }
  },
     created() {
       //this.Online=new Array[34];
       //localStorage.removeItem('_AMap_raster');
        //Vue.use(VueAMap);
       //localStorage.removeItem('_AMap_raster');
       //Vue.use(VueAMap);
       this.position[0]=[116.3,40.1];this.position[1]=[117.3,39.1];this.position[2]=[121.5,31.2];this.position[3]=[106.5,29.5];this.position[4]=[115.2,38.3];
       this.position[5]=[112.2,37.4];this.position[6]=[123.2,41.4];this.position[7]=[125.4,43.9];this.position[8]=[128,47.7];this.position[9]=[119.9,33];
       this.position[10]=[120,29];this.position[11]=[117.5,31.9];this.position[12]=[118,26.1];this.position[13]=[115.7,27.6];this.position[14]=[117.9,36.2];
       this.position[15]=[113.5,33.9];this.position[16]=[111.9,31.3];this.position[17]=[111.7,27.5];this.position[18]=[113.7,23.5];this.position[19]=[109.6,19];
       this.position[20]=[102.7,30.6];this.position[21]=[107.2,26.7];this.position[22]=[101.2,24.3];this.position[23]=[109.1,34.6];this.position[24]=[104.4,35.3];
       this.position[25]=[96,35.5];this.position[26]=[109.7,41.3];this.position[27]=[108.7,23.6];this.position[28]=[88.1,31.6];this.position[29]=[106,37.1];
       this.position[30]=[85.7,41.3];this.position[31]=[114.1,22.3];this.position[32]=[113.5,22.2];this.position[33]=[120.9,23.8];
       var that=this;
        for(var i=0;i<34;i++)
        {
          that.count[i]=0;
          
                    //that.firstdata[i]={};
        }
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
        var that=this;
        axios.get(localStorage.getItem('urls')+"api/Basestation/AllPos/").then(function(res){ 
        //var newdata=res.data.results;
        console.log(res.data);
        var newdata=res.data.results;

        for(var i=0;i<newdata.length;i++)
        {
          for(var j=0;j<34;j++)
          {
            if(that.pros[j]==newdata[i].Province)
            {
              that.firstdata[j].push(newdata[i]);
              that.count[j]=that.count[j]+1;
              break;
            }
          }
        }
        console.log(that.firstdata[0]);
        console.log(that.count[0]);
        for(var i=0;i<34;i++)
        {
          that.Online[i]=true;
          for(var j=0;j<that.firstdata[i].length;j++)
          {
            if(that.firstdata[i][j].IsOnline==false)
            {
              that.Online[i]=false;
              console.log(that.Online[i]);
              break;
            }
          }
         }
         that.marke();
        })





        // console.log(res);
        // let markers = [];
        // let windows = [];
        // let num = 10;
        // let self = that;
        // for (let i = 0 ; i < newdata.length ; i ++) {     //newdata.length
        //   markers.push({
        //     moutpoint:newdata.mountpoint,
        //     position: [newdata[i].Longitude,newdata[i].Latitude],
        //     content: '',
        //     events: {
        //       click() {
                
        //         self.windows.forEach(window => {
        //           window.visible = false;

        //         });

        //         self.window = self.windows[i];
        //         self.$nextTick(() => {
        //           self.window.visible = true;
        //           //console.log(self.window.content);
        //           var con=self.window.content;
        //           //var ss=con.slice(20);
        //           var ss=con.split('>');
        //           var s=ss[1].split('<');
        //           //console.log(s[0]);
        //           axios.get(localStorage.getItem('urls')+"api/Basestation/"+s[0]).then(function(res){
        //               var online=null;
        //               var color=null;
        //               var result=res.data.results;
        //               if(result[0].IsOnline)
        //               {
        //                 online="在线";
        //                 color="bule"
        //                 self.window.content=`<div class="prompt" style="font-size:10px;">${ s[0] }</div><div class="prompt" style="font-size:10px;color:green">${ online }</div>`
        //               }
        //               else
        //               {
        //                 online="未在线"
        //                 color="red"
        //                 self.window.content=`<div class="prompt" style="font-size:10px;">${ s[0] }</div><div class="prompt" style="font-size:10px;color:red">${ online }</div>`
        //               }
        //               //self.window.content=`<div class="prompt" style="font-size:10px;">${ s[0] }</div><div class="prompt" style="'font-size:10px;color:'+(color)">${ online }</div>`
        //               //console.log(res.data);
        //           }).catch(function(error){
        //                  // console.log("error.data");
                         
        //                 });

        //         });
        //       }
        //     }
        //   });

        //   windows.push({
        //     position: [newdata[i].Longitude,newdata[i].Latitude],
        //     content: `<div class="prompt">${ newdata[i].Mountpoint }</div>`,
        //     visible: false
        //   });
        // }

        // that.markers = markers;
        // that.windows = windows;
        // }).catch(function(error){
        //         //console.log("error.data");
        //       });
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

        //搜索按钮触发
        searchinf:function(){
          var that=this;
          console.log(this.searchtext);
            //var ss=document.getElementById("aaa");
            // var ss=this.$refs["cors_123"];
            // console.log(this.$refs);
            // console.log(ss);
            // console.log(ss[0].position);
            //ss.icon = "../../assets/img/img.jpg";
            var flag=false;
          for(var i=0;i<34;i++)
          {
            for(var j=0;j<that.firstdata[i].length;j++)
            {
              if(that.firstdata[i][j].Mountpoint==this.searchtext)
              {
                console.log("进来了")
                that.markers=null;
                that.showDetails(i,true);
                flag=true;
                break;
              }
            }
            if(flag)
            {
              break;
            }
          }

          if(flag)
          {
              axios.get(localStorage.getItem('urls')+"api/Basestation/"+that.searchtext).then(function(res){
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
              that.window.content=`<div class="prompt" style="font-size:10px;">${ result[0].Mountpoint }</div><div class="prompt" style="font-size:10px;color:${color}">${ online }</div>`,
              that.window.visible=true
              })
              // .catch(function(error){
              //             // console.log("error.data");
              //             that.$message.success('搜索失败');
              //             });
            

            })
          }
          else
          {
            that.$message.error('没有找到此基站');
          }

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
        //返回按钮触发
        changemap(changezoom){
          
            if(changezoom)
            {
              
              this.center=[105.59996, 37.197646];
              this.newamap.setZoom(5);
              //this.zoom=5;
            }
            this.IsMarker=true;
            this.IsPoint=false;
            this.points=null;
            this.window='';
            this.marke();
        },
        marke(){
          var that=this;
          let markers = [];
          var markcontent;
        for (let i = 0 ; i < that.count.length ; i ++)
        {
          if(that.Online[i])//
          {
            markcontent= `<div  style="text-align:center;padding-top:5px; background-color: hsla(180, 100%, 50%, 0.6); height: 24px; width: 35px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;">${ that.count[i] }</div>`;
          }
          else
          {
            markcontent= `<div  style="text-align:center;padding-top:5px; background-color:  hsla(5,100%,50%,0.6); height: 24px; width: 35px; border: 0px solid hsl(5, 100%, 40%); border-radius: 12px; box-shadow: hsl(5, 100%, 50%) 0px 0px 1px;">${ that.count[i] }</div>`;
          }
          console.log(that.count[i]);
          markers.push({
             position: that.position[i],
             content:markcontent,
             //content:'',
             //offset:new AMap.Pixel(-13,-30),
             offset:{x:-13,y:-30},
             events: {
              click() {
               if(that.count[i]==0)
                { }
                else
                {
                  that.markers=null;
                  that.showDetails(i,true);
                }
              },
              init(o) {
                console.log("562");
                console.log(o);
                //self.markerRefs.push(o);
              }
             }
          })
        }
        that.markers=markers;
        },
        showDetails:function(i,changemark){
          var that=this;
          if(changemark)
          {
            this.center=this.position[i]; 
            this.newamap.setZoom(7);                           //[this.firstdata[i][0].Longitude,this.firstdata[i][0].Latitude];
            //this.zoom=7;
          }
          //console.log(that.ce)
          //this.IsMarker=false;
          //this.IsPoint=true;
          var that=this;
          /*
          var newdata=[];
          for(var i=0;i<34;i++)
          {
            for(var j=0;j<this.firstdata[i].length;j++)
            {
              newdata.push(this.firstdata[i][j]);
            }
          }*/
          var newdata=this.firstdata[i];
           //var newdata=that.ce;
          //console.log(res);
          let markers = [];
          let windows = [];
          let num = 10;
          let self = that;
          var markcontent;
          for (let i = 0 ; i < newdata.length ; i ++) {     //newdata.length
            if(newdata[i].IsOnline)//
            {
              console.log("绿色")
              markcontent='' +
                        '<div class="custom-content-marker">' +
                        '   <img src="//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png">' +
                        //'   <div class="close-btn" onclick="clearMarker()">X</div>' +
                        '</div>';
            }
            else
            {
              markcontent='' +
                        '<div class="custom-content-marker">' +
                        '   <img src="//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png">' +
                        //'   <div class="close-btn" onclick="clearMarker()">X</div>' +
                        '</div>';
            }
            markers.push({
              moutpoint:newdata.Mountpoint,
              //icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png",
              position: [newdata[i].Longitude,newdata[i].Latitude],
              content: markcontent,
              //offset:{x:-13,y:-30},
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
          console.log(markers);
          that.points = markers;
          that.windows = windows;
        },
        onSearchResult(pois){
          console.log(pois)
        }         
      }
   
}

</script>

<style>
.amap-wrapper {
  width: 100%;
  height: 95%;
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
.custom-content-marker {
            position: relative;
            width: 25px;
            height: 34px;
        }

        .custom-content-marker img {
            width: 100%;
            height: 100%;
        }

        .custom-content-marker .close-btn {
            position: absolute;
            top: -6px;
            right: -8px;
            width: 15px;
            height: 15px;
            font-size: 12px;
            background: #ccc;
            border-radius: 50%;
            color: #fff;
            text-align: center;
            line-height: 15px;
            box-shadow: -1px 1px 1px rgba(10, 10, 10, .2);
        }

        .custom-content-marker .close-btn:hover{
            background: #666;
        }

</style>