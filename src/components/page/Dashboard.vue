<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img src="../../assets/img/img.jpg" class="user-avator" alt="">
                        <div class="user-info-cont">
                            <div class="user-info-name">{{name}}</div>
                            <div>{{role}}</div>
                        </div>
                    </div>
                    <div class="user-info-list">上次登录时间：<span>{{time}}</span></div>
                    <div class="user-info-list">日志：<span></span><span><el-button
                            type="text" 
                            class="el-icon-lx-text"
                            style="color:blue"
                            @click="handlejournal"
                        >移动站</el-button>
                        <el-button
                            type="text" 
                            class="el-icon-lx-text"
                            style="color:blue"
                            @click="handlejournal2()"
                        >用户</el-button></span></div>
                </el-card>
                <el-card shadow="hover" style="height:252px;">
                    <div slot="header" class="clearfix">
                        <span>服务</span>
                    </div>
                    服务地址:
                    <h1  disabled style="color:#42b983;padding-left:0px">196.236.20.20</h1>
                    服务端口:
                    <h1  disabled style="color:#42b983;padding-left:0px">5000</h1>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{mobileline}}</div>
                                    <div>移动站在线情况</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{connectmountpoint}}</div>
                                    <div>已连接基站</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{BaseLine}}</div>
                                    <div>已连接基站状态</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" style="height:403px;">
                    <div slot="header" class="clearfix">
                        <span>已获权限基站</span>
                        <!-- <el-button style="float: right; padding: 3px 0" type="text">添加</el-button> -->
                    </div>
                    <el-table :data="database" :show-header="true" border style="width: 100%;font-size:14px">
                        <!-- ;overflow-y:scroll -->
                        
                        <el-table-column label="基站名" align="center">
                            <template slot-scope="scope" >
                                <div class="todo-item"  style="color:blue;font-size:20px">{{scope.row.Mountpoint}}</div>
                            </template>
                            <!-- <el-scrollbar slot-scope="scope" >
                                <el-row :gutter="12"  :class="{'todo-item-del': scope.row.status}" style="color:blue;font-size:20px;padding-left:60px">{{scope.row.title}}</el-row>
                            </el-scrollbar> -->
                        </el-table-column>
                        <el-table-column label="到期时间" align="center">
                            <template slot-scope="scope" >
                                <div class="todo-item"  style="color:blue;font-size:20px">{{scope.row.ExpirationTime}}</div>
                            </template>
                            <!-- <el-scrollbar slot-scope="scope" >
                                <el-row :gutter="12"  :class="{'todo-item-del': scope.row.status}" style="color:blue;font-size:20px;padding-left:60px">{{scope.row.title}}</el-row>
                            </el-scrollbar> -->
                        </el-table-column>
                        <!-- <el-table-column width="60" slot-scope="scope"> -->
                        <el-table-column width="80" label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button
                                    type="text" 
                                    class="el-icon-edit"
                                    style="color:blue;font-size:15px"
                                    @click="handlejournaljz(scope.$index, scope.row)"
                                >日志</el-button>
                                <!-- <i class="el-icon-edit">续费</i>
                                <i class="el-icon-delete"></i> -->
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="bar" class="schart" canvasId="bar" :data="data" type="bar" :options="options"></schart>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="line" class="schart" canvasId="line" :data="data" type="line" :options="options2"></schart>
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
    </div>
</template>

<script>
    import Schart from 'vue-schart';
    import bus from '../common/bus';
    import * as signalR from '@aspnet/signalr';
    import axios from 'axios';
    //import websock from 'signalr';
    export default {
        name: 'dashboard',
        data() {
            return {
                jour:[],     //存放日志
                Journal:false,   //显示日志框
                time:'',  //上次登录时间
                mobileline:"NULL",
                connectmountpoint:"NULL",
                BaseLine:"NULL",
                database:[],      //用户已购买基站信息
                tableData:[],
                basestation:[],
                name: localStorage.getItem('ms_username'),
                todoList: [],
                data1:[],
                data2:[],
                data: [{
                        name: '2018/09/04',
                        value: true
                    },
                    {
                        name: '2018/09/05',
                        value: true
                    },
                    {
                        name: '2018/09/06',
                        value: true
                    },
                    {
                        name: '2018/09/07',
                        value: false
                    },
                    {
                        name: '2018/09/08',
                        value: true
                    },
                    {
                        name: '2018/09/09',
                        value: true
                    },
                    {
                        name: '2018/09/10',
                        value: false
                    }
                ],
                options: {
                    title: '最近七天移动站登陆情况',
                    showValue: true,
                    fillColor: 'rgb(45, 140, 240)',
                    bottomPadding: 30,
                    topPadding: 30,
                    yEqual: 1,
                },
                options2: {
                    title: '最近七天网站登陆情况',
                    fillColor: '#FC6FA1',
                    axisColor: '#008ACD',
                    contentColor: '#EEEEEE',
                    bgColor: '#F5F8FD',
                    bottomPadding: 30,
                    yEqual: 1,
                    topPadding: 30
                }
            }
        },
        components: {
            Schart
        },
        computed: {
            role() {
                return this.name === 'admin' ? '超级管理员' : '普通用户';
            }
            
        },
        created(){
            var that=this;
            console.log("632");
            axios.get(localStorage.getItem('urls')+"api/User/UserInfo/"+localStorage.getItem('ms_username')).then(function(res){
                console.log(res);
                that.tableData = res.data.results[0];
                that.database=res.data.results[0].MountpointList;
                that.time = res.data.results[0].PreviousLoginTime;
            })

            if(that.tableData.IsOnline)//
            {
                that.mobileline="在线";
                that.connectmountpoint=that.tableData.connectmountpoint;
                axios.get(localStorage.getItem('urls')+"api/Mountpoint/"+that.tableData.ConnectingBasestation).then(function(res){
                    console.log(res);
                    if(res.data.results[0].IsOnline)
                    {
                        that.BaseLine="在线";
                    }
                    else
                    {
                        that.BaseLine="未在线";
                    }
                })
            }
            else
            {
                that.mobileline="未在线";
            }
            //获取移动站七天在线情况
            axios.get(localStorage.getItem('urls')+"api/User/"+localStorage.getItem('ms_username')).then(function(res){
                console.log(res);
                for(var i=0;i<7;i++)
                {
                    that.data[i].value=res.data.results[i];
                }
                
            })
            //获取用户七天在线情况
            axios.get(localStorage.getItem('urls')+"api/User/"+localStorage.getItem('ms_username')).then(function(res){
                console.log(res);
                that.tableData = res.data.results;
                for(var i=0;i<that.tableData.MountpointList;i++)
                {
                    that.todoList.push({
                        title:that.tableData.MountpointList[i],
                        time:that.tableData.VIPExpirationDate[i]
                    })
                }
                
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
                    item.name = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()-1}`
                })
            },
            handlejournaljz(index,row){
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
            //移动站日志   已完成
        handlejournal(index,row){
            console.log("55");
            var that=this;
            that.form=row;
            that.jour=[];
                axios.get(localStorage.getItem('urls')+"api/User/NtripClientLogs/"+localStorage.getItem('ms_username')).then(function(res){
                    console.log(res);
                    for(var i=0;i<res.data.results[0].NtripClientLogs.length;i++)
                    {
                        that.jour.push(res.data.results[0].NtripClientLogs[i].LogTime+res.data.results[0].NtripClientLogs[i].LogMessage);
                    }
                })
            this.Journal=true;
        },
        //用户日志
        handlejournal2(index,row){
            console.log("55");
            var that=this;
            that.form=row;
            that.jour=[];
                axios.get(localStorage.getItem('urls')+"api/User/UserLogs/"+localStorage.getItem('ms_username')).then(function(res){
                    console.log(res);
                    for(var i=0;i<res.data.results[0].UserLogs.length;i++)
                    {
                        that.jour.push(res.data.results[0].UserLogs[i].LogTime+res.data.results[0].UserLogs[i].LogMessage);
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
        },
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
