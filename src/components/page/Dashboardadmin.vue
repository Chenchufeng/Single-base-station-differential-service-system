<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:220px;">
                    <div class="user-info">
                        <img src="../../assets/img/img.jpg" class="user-avator" alt="">
                        <div class="user-info-cont">
                            <div class="user-info-name">{{name}}</div>
                            <div>{{role}}</div>
                        </div>
                    </div>
                    <div class="user-info-list">上次登录时间：<span>{{time}}</span></div>
                    <!-- <div class="user-info-list">上次登录地点：<span>东莞</span></div> -->
                </el-card>
                <el-card shadow="hover" style="height:284px;">
                    <div slot="header" class="clearfix">
                        <span>低在线率基站</span>
                    </div>
                    <el-table :data="database1" :show-header="true" border height="247" style="width: 100%;font-size:13px">
                        

                        <!-- <el-table-column width="40">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.status"></el-checkbox>
                            </template>
                        </el-table-column> -->
                        <el-table-column label="基站名" align="center">
                            <template slot-scope="scope" style="height:20px">
                                <div class="todo-item"  style="color:blue;font-size:13px;height:20px">{{scope.row.Mountpoint}}</div>
                            </template>
                            <!-- <el-scrollbar slot-scope="scope" >
                                <el-row :gutter="12"  :class="{'todo-item-del': scope.row.status}" style="color:blue;font-size:20px;padding-left:60px">{{scope.row.title}}</el-row>
                            </el-scrollbar> -->
                        </el-table-column>
                        <el-table-column label="在线率" align="center">
                            <template slot-scope="scope" style="height:20px">
                                <div class="todo-item"  style="color:blue;font-size:13px;height:20px">{{scope.row.OnlinePercent}}</div>
                            </template>
                            <!-- <el-scrollbar slot-scope="scope" >
                                <el-row :gutter="12"  :class="{'todo-item-del': scope.row.status}" style="color:blue;font-size:20px;padding-left:60px">{{scope.row.title}}</el-row>
                            </el-scrollbar> -->
                        </el-table-column>
                        
                        <!-- <el-table-column width="60" slot-scope="scope"> -->
                        <el-table-column width="160" label="信息" align="center">
                            <template slot-scope="scope">
                                <el-button
                                    type="text" 
                                    class="el-icon-lx-text"
                                    @click="handlejournal(scope.$index, scope.row)"
                                >日志</el-button>
                                <el-button   
                                    type="text" 
                                    class="el-icon-edit"
                                    @click="handledeal(scope.$index, scope.row)"
                                >处理</el-button>
                                <!-- <i class="el-icon-edit">续费</i>
                                <i class="el-icon-delete"></i> -->
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="6">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num"  v-if="caster">{{caster}}</div>
                                    <div class="grid-num" style="color:red" v-else>{{caster}}</div>
                                    <div>Caster在线情况</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="6">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num" style="color:red">{{allaccountnum}}</div>
                                    <div>用户总量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="6">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-home grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num" style="color:red">{{allmountpointnum}}</div>
                                    <div>基站总量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="6">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-roundclose grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{onlinenum}}</div>
                                    <div>当前未在线基站数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" style="height:403px;">
                    <div slot="header" class="clearfix">
                        <span>当前未在线基站</span>
                        <!-- <el-button style="float: right; padding: 3px 0" type="text">添加</el-button> -->
                    </div>
                    <el-table :data="database2" :show-header="true" height="294" style="width: 100%;font-size:14px">
                        <!-- overflow-y:scroll -->
                        
                        <el-table-column label="基站名" align="center">
                            <template slot-scope="scope" >
                                <div class="todo-item"  style="color:blue;font-size:20px;padding-left:60px">{{scope.row.Mountpoint}}</div>
                            </template>
                            <!-- <el-scrollbar slot-scope="scope" >
                                <el-row :gutter="12"  :class="{'todo-item-del': scope.row.status}" style="color:blue;font-size:20px;padding-left:60px">{{scope.row.title}}</el-row>
                            </el-scrollbar> -->
                        </el-table-column>
                        <el-table-column label="在线率" align="center">
                            <template slot-scope="scope" >
                                <div class="todo-item"  style="color:blue;font-size:20px">{{scope.row.OnlinePercent}}</div>
                            </template>
                            <!-- <el-scrollbar slot-scope="scope" >
                                <el-row :gutter="12"  :class="{'todo-item-del': scope.row.status}" style="color:blue;font-size:20px;padding-left:60px">{{scope.row.title}}</el-row>
                            </el-scrollbar> -->
                        </el-table-column>
                        <!-- <el-table-column width="60" slot-scope="scope"> -->
                        <el-table-column width="160" label="信息" align="center">
                            <template slot-scope="scope">
                                <el-button
                                    type="text" 
                                    class="el-icon-lx-text"
                                    @click="handlejournal(scope.$index, scope.row)"
                                >日志</el-button>
                                <el-button
                                    type="text" 
                                    class="el-icon-edit"
                                    @click="handledeal(scope.$index, scope.row)"
                                >处理</el-button>
                                
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20" >
            <el-col :span="12" >
                <el-card shadow="hover" >
                    <schart ref="bar" class="schart" canvasId="bar"  :data="data1" type="bar" :options="options"></schart>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover" >
                    <schart ref="line" class="schart" canvasId="line" :data="data2" type="line" :options="options2"></schart >
                </el-card>
            </el-col>
        </el-row>
        <!-- 日志信息弹出框 -->
        <el-dialog title="日志" :visible.sync="Journal">
                    <el-table :data="jour" :show-header="false" height="347" style="width: 100%;font-size:13px;overflow:scroll">
                        <el-table-column >
                            <template slot-scope="scope" style="height:20px">
                                <div class="todo-item" style="color:blue;font-size:13px;height:20px">{{scope.row}}</div>
                            </template>
                        </el-table-column>   
                    </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="Journal = false">返回</el-button>
                </span>
        </el-dialog>
        <!-- 处理弹出框 -->
        <el-dialog title="处理" :visible.sync="deal" width="400px">
                <div>联系人：{{LinkMan}}</div>
                <div>联系方式：{{MobilePhone}}</div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="deal = false">返回</el-button>
                </span>
        </el-dialog>

    </div>
</template>

<script>
    import Schart from 'vue-schart';
    import bus from '../common/bus';
    import * as signalR from '@aspnet/signalr';
    import axios from 'axios';
    import vm from '../../utils/utils.js';
    //import websock from 'signalr';
    export default {
        name: 'dashboard',
        data() {
            return {
                LinkMan:"",        //联系人
                MobilePhone:"",     //联系方式
                time:'',           //上次登陆时间
                caster:false,       //caster是否在线
                onlinenum:0,         //基站不在线数量
                allmountpointnum:0,   //所有基站数量
                allaccountnum:0,      //用户总量
                database1:[],      //低在线率基站数据
                database2:[],       //当前未在线基站数据
                form:{},
                jour:[],   //存储日志信息
                deal:false,
                Journal:false,
                basestation:[],
                name: localStorage.getItem('ms_username'),
                todoList: [{
                        Mountpoint: 'Mountpoint69',
                        OnlinePercent:"0.6",
                        status: false,
                    },
                    {
                         Mountpoint: 'Mountpoint1569',
                        OnlinePercent:"0.7",
                        status: false,
                    },
                    {
                         Mountpoint: 'Mountpoint659',
                        OnlinePercent:"0.62",
                        status: false,
                    }, 
                    {
                         Mountpoint: 'Mountpoint3659',
                        OnlinePercent:"0.75",
                        status: false,
                    },
                    {
                         Mountpoint: 'Mountpoint4529',
                        OnlinePercent:"0.65",
                        status: false,
                    }, 
                    {
                         Mountpoint: 'Mountpoint456',
                        OnlinePercent:"0.51",
                        status: false,
                    },
                    {
                         Mountpoint: 'Mountpoint159',
                        OnlinePercent:"0.63",
                        status: false,
                    },
                ],
                data1:[],       //低在线率图表数据
                data2:[],       //当前未在线图表数据
                data: [{
                        //name: '2018/09/04',
                        name:"Mountpoint69",
                        value: 0.6
                    },
                    {
                        //name: '2018/09/05',
                        name:"Mountpoint1569",
                        value: 0.7
                    },
                    {
                        //name: '2018/09/06',
                        name:"Mountpoint659",
                        value: 0.62
                    },
                    {
                        //name: '2018/09/07',
                        name:"Mountpoint3659",
                        value: 0.75
                    },
                    {
                        //name: '2018/09/08',
                        name:"Mountpoint4529",
                        value: 0.65
                    },
                    {
                        //name: '2018/09/09',
                        name:"Mountpoint456",
                        value: 0.51
                    },
                    {
                        //name: '2018/09/10',
                        name:"Mountpoint159",
                        value: 0.63
                    }
                ],
                options: {
                    title: '低在线率基站在线率',
                    autoWidth: true,
                    showValue: true,
                    fillColor: 'rgb(45, 140, 240)',
                    bottomPadding: 30,
                    topPadding: 30,
                    yEqual: 0.01,
                    yAxis: {          //纵轴标尺固定
                   
                        type: 'value',
                        scale: true,
                        name: '销量',
                        max: 1,
                        min: 0.0001,
                        boundaryGap: [0.2, 0.2]

                    },
                    direction: 'horizontal',

                },
                options2: {
                    title: '当前未在线基站在线率',
                    autoWidth: true,
                    yEqual: 0.01,
                    fillColor: '#FC6FA1',
                    axisColor: '#008ACD',
                    contentColor: '#EEEEEE',
                    bgColor: '#F5F8FD',
                    bottomPadding: 30,
                    topPadding: 30
                }
            }
        },
        components: {
            Schart
        },
        computed: {
            role() {
                if(localStorage.getItem('ms_usertype') === 'ADMIN')
                {
                    return "超级管理员";
                }
                else if(localStorage.getItem('ms_usertype') === 'TECHNOLOGY')
                {
                    return "技术员";
                }
                else
                {
                    return "普通用户";
                }
                //return localStorage.getItem('ms_usertype') === 'ADMIN' ? '超级管理员' : '普通用户';
            }
            
        },
        created(){
            var that=this;
            //请求基站数量
            this.getallmountpointnum();
            //请求用户数量
            this.getallaccountnum();
            //请求当前未在线基站数量
            this.getonlinenum();
            //请求上次登录时间
            this.gettime();
            //请求低在线率
            this.getminline();
            //请求当前未在线
            this.getnotline();

            //请求caster是否在线
            //this.getcaster();

            vm.$on('caster', function (msg) {
                if(msg=="True")
                {
                    that.caster=true;
                }
                else
                {
                    that.caster=false;
                }
                
                //that.inf = JSON.parse(localStorage.getItem('inf'));
            })




            this.basestation=["cors_123---2019-02-02到期","cors_456---2019-02-02到期"]

            this.handleListener();
            this.changeDate();
        },
        activated(){
            this.handleListener();
        },
        deactivated(){
            window.removeEventListener('resize', this.renderChart);
            bus.$off('collapse', this.handleBus);
        },
        methods: {
            changeDate(){
                const now = new Date().getTime();
                this.data.forEach((item, index) => {
                    const date = new Date(now - (6 - index) * 86400000);
                    item.name = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
                })
            },
            //获取上次登录时间
            gettime(){
                var that=this;
                console.log(localStorage.getItem('ms_username'));
                 axios.get(localStorage.getItem('urls')+"api/User/UserInfo/"+localStorage.getItem('ms_username')).then(function(res){
                    console.log(res);
                    that.time = res.data.results[0].PreviousLoginTime;
                })
            },
            //请求当前未在线基站数量
            getonlinenum(){
                var that=this;
                axios.get(localStorage.getItem('urls')+"api/Basestation/OfflineCount").then(function(res){
                    console.log(res);
                    that.onlinenum = res.data.results[0].count;
                })
            },
            //获取caster是否在线
            
            getcaster(){
                var that=this;
                axios.get(localStorage.getItem('urls')+"api/Basestation/PageByCity").then(function(res){
                    console.log(res);
                    that.caster = res.data.caster;
                })
            },
            //请求在线率低的基站
            getminline(){
                var that=this;
                axios.get(localStorage.getItem('urls')+"api/Basestation/BasestationOnlineTime").then(function(res){
                    console.log(res);
                    that.database1 = res.data.results;
                   if(that.database1.length>6)
                    {
                        var base=[];
                        var max=0;
                        var maxindex=0;
                        var flag=true;
                        for(var i=0;i<6;i++)      //database2.length
                        {
                            console.log(that.database1[i].Mountpoint);
                            base[i]=that.database1[i];
                            //that.data1[i]
                        }
                        for(var i=6;i<that.database1.length;i++)
                        {
                            if(flag)
                            {
                                for(var j=0;j<6;j++)
                                {
                                    if(base[j].OnlinePercent.toFixed(4)>max)
                                    {
                                        max=base[j].OnlinePercent.toFixed(4);
                                        maxindex=j;
                                    }
                                    
                                }
                            }
                            
                            if(that.database1[i].OnlinePercent.toFixed(4)<base[maxindex].OnlinePercent.toFixed(4))
                            {
                                base[maxindex]=that.database1[i];
                                flag=true;
                                //break;
                            }
                            else
                            {
                                flag=false;
                            }
                        }
                        for(var i=0;i<6;i++)      //database2.length
                        {

                            that.data1.push({
                                name: base[i].Mountpoint,
                                value:base[i].OnlinePercent.toFixed(4)                        //database2[i].onlinePercent
                            })
                            //that.data1[i]
                        }
                    }
                    else
                    {
                        for(var i=0;i<that.database1.length;i++)      //database2.length
                        {
                            console.log(that.database1[i].Mountpoint);
                            that.data1.push({
                                name: that.database1[i].Mountpoint,
                                value:that.database1[i].OnlinePercent.toFixed(4)                        //database2[i].onlinePercent
                            })
                            //that.data1[i]
                        }
                    }
                })
               
                console.log("963");
                console.log(that.data1);
            },
            //请求当前未在线基站
            getnotline(){
                var that=this;
                axios.get(localStorage.getItem('urls')+"api/Basestation/OfflineBasestationInfo").then(function(res){
                    console.log(res);
                    that.database2 = res.data.results;
                    
                    if(that.database2.length>6)
                    {
                        var base=[];
                        var max=0;
                        var maxindex=0;
                        var flag=true;
                        for(var i=0;i<6;i++)      //database2.length
                        {
                            console.log(that.database2[i].Mountpoint);
                            base[i]=that.database2[i];
                            //that.data1[i]
                        }
                        for(var i=6;i<that.database2.length;i++)
                        {
                            if(flag)
                            {
                                for(var j=0;j<6;j++)
                                {
                                    if(base[j].OnlinePercent.toFixed(4)>max)
                                    {
                                        max=base[j].OnlinePercent.toFixed(4);
                                        maxindex=j;
                                    }
                                    
                                }
                            }
                            
                            if(that.database2[i].OnlinePercent.toFixed(4)<base[maxindex].OnlinePercent.toFixed(4))
                            {
                                base[maxindex]=that.database2[i];
                                flag=true;
                                //break;
                            }
                            else
                            {
                                flag=false;
                            }
                        }
                        for(var i=0;i<6;i++)      //database2.length
                        {

                            that.data2.push({
                                name: base[i].Mountpoint,
                                value:base[i].OnlinePercent.toFixed(4)                        //database2[i].onlinePercent
                            })
                            //that.data1[i]
                        }
                    }
                    else
                    {
                        for(var i=0;i<that.database2.length;i++)      //database2.length
                        {
                            console.log(that.database2[i].Mountpoint);
                            that.data2.push({
                                name: that.database2[i].Mountpoint,
                                value:that.database2[i].OnlinePercent.toFixed(4)                        //database2[i].onlinePercent
                            })
                            //that.data1[i]
                        }
                    }
                    
                })
                
            },
            //请求用户数量
            getallaccountnum(){
                var that=this;
                axios.get(localStorage.getItem('urls')+"api/User/Count").then(function(res){
                    console.log(res.data);
                    that.allaccountnum=res.data.results[0].count;
                })
            },
            //请求基站数量
            getallmountpointnum(){
                console.log("10");
                var that=this;
                axios.get(localStorage.getItem('urls')+"api/Basestation/Count").then(function(res){
                    console.log(res.data);
                    that.allmountpointnum=res.data.results[0].count;
                })
            },
            //处理    显示联系人联系方式
            handledeal(index,row){
                var that=this;
                console.log(index);
                console.log(row);
                this.form=row;
                this.deal=true;
                axios.get(localStorage.getItem('urls')+"api/Basestation/"+that.form.Mountpoint).then(function(res){
                    console.log("res");
                    that.LinkMan=res.data.results[0].LinkMan;
                    that.MobilePhone=res.data.results[0].ContactNumber;
                })
            },
            //日志        根据挂载点请求对应日志信息
            handlejournal(index,row){
                // var that=this;
                // axios.get(localStorage.getItem('urls')+"api/Basestation/PageByCity",{
                //     params:{
                //         mountpoint:form.mountpoint
                //     }
                // }).then(function(res){
                //     console.log(res);
                //     that.jour = res.data.results;
                // })

                // console.log(index);
                // console.log(form);
                // this.Journal=true;


                var that=this;
                that.form=row;
                that.jour=[];
                    axios.get(localStorage.getItem('urls')+"api/Basestation/MountpointLogs/"+that.form.Mountpoint).then(function(res){
                        console.log(res);
                        for(var i=0;i<res.data.results[0].Logs.length;i++)
                        {
                            that.jour.push(res.data.results[0].Logs[i].LogTime+res.data.results[0].Logs[i].LogMessage);
                        }
                    })
                this.Journal=true;
            },
            handleListener(){
                bus.$on('collapse', this.handleBus);
                // 调用renderChart方法对图表进行重新渲染
                window.addEventListener('resize', this.renderChart)
            },
            handleBus(msg){
                setTimeout(() => {
                    this.renderChart()
                }, 300);
            },
            renderChart(){
                this.$refs.bar.renderChart();
                this.$refs.line.renderChart();
            }
        }
    }

</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
        color: rgb(13, 16, 233);
    }

    .todo-item-del {
        text-decoration: line-through;
        color: rgb(13, 16, 233);
    }

    .schart {
        width: 100%;
        height: 300px;
    }

</style>
