<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 基础表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                    v-if="admin"
                >批量删除</el-button>
                <!--<el-select v-model="selectCate" placeholder="筛选省份" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>-->
                <el-input v-model="selectWord" placeholder="输入用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" class="el-icon-lx-add" @click="handleAdd" v-if="admin"> 添加新用户</el-button>
                <el-button type="primary"  @click="handleBack" v-if="admin"> 返回</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                
                <el-table-column prop="Account" label="用户名" align="center"></el-table-column>
                
                <!-- <el-table-column label="密码">
                    <template slot-scope="scope">{{scope.row.PassWord}}</template>
                </el-table-column>  -->
                
                <el-table-column label="密码" class="search-box" width="120" align="center">

                   <!-- value="scope.row.password" -->
                   <!-- <template slot-scope="scope">
                     <el-input  type="text"  :value="scope.row.password"></el-input>
                   </template> -->
                    <!-- <el-button ></el-button> -->
                    <template slot-scope="scope">   
                         <input  class="search-input" :id="scope.$index" type="password" :value="scope.row.Password"  style="float:left"/><el-button  
                            type="text"
                            icon="el-icon-lx-attention"
                            @click="handlepwd(scope.$index, scope.row)"
                        ></el-button> 
                    </template>
           
                   
                    
                </el-table-column>
              
                <el-table-column prop="AccountType" label="用户类型" align="center"></el-table-column>
                
                
                
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.IsOnline===true?'success':(scope.row.IsOnline===false?'danger':'')"
                        >{{scope.row.IsOnline}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="ConnectingBasestation" label="连接基站" align="center"></el-table-column>
                <el-table-column  label="开放基站及到期时间" align="center">
                <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-lx-attention"
                            @click="handleGGA(scope.$index, scope.row)"
                        >展开</el-button>
                </template>
                </el-table-column>
                <el-table-column prop="CreateTime" label="创建时间" align="center"></el-table-column>
           
                <!-- <el-table-column prop="VipExpirationDate" label="到期时间" align="center"></el-table-column> -->
                <el-table-column prop="MobilePhone" label="联系方式" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center" v-if="admin">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                            v-if="admin"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                            v-if="admin"
                        >删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="日志" width="180" align="center" >
                    <template slot-scope="scope">
                        <el-button
                            type="text" 
                            class="el-icon-lx-text"
                            style="color:blue"
                            @click="handlejournal(scope.$index, scope.row)"
                        >移动站</el-button>
                        <el-button
                            type="text" 
                            class="el-icon-lx-text"
                            style="color:blue"
                            @click="handlejournal2(scope.$index, scope.row)"
                        >用户</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="page.index"
                    :page-size="page.size"
                    :total="page.total"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
        <!-- 日志信息弹出框 -->
        <el-dialog title="日志" :visible.sync="Journal">
                    <el-table :data="jour" :show-header="false" height="327px"  style="font-size:13px;overflow:scroll">
                        <el-table-column >
                            <template slot-scope="scope"  style="height:20px;width:400px" >
                                <div class="todo-item" style="color:blue;font-size:13px;height:20px;width:1000px">{{scope.row}}</div>
                            </template>
                        </el-table-column>   
                    </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="Journal = false">返回</el-button>
                </span>
        </el-dialog>
         <!-- 开放基站到期时间弹出框 -->
        <el-dialog title="开放基站及到期时间" :visible.sync="openmountpoint" width="350px">
                    <el-table :data="openmountpointdata" :show-header="false" height="300" style="width: 100%;font-size:13px;overflow:scroll">
                        <el-table-column >
                            <template slot-scope="scope" style="height:20px">
                                <div class="todo-item" style="color:blue;font-size:13px;height:20px">{{scope.row}}</div>
                            </template>
                        </el-table-column>   
                    </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="openmountpoint = false">返回</el-button>
                </span>
        </el-dialog>       
        <!-- 编辑弹出框 -->
        <el-dialog :title="title"  :visible.sync="editVis" width="400px">
            <el-form ref="form" :rules="loginRules" :model="form" label-width="80px">
                <el-form-item label="用户名" prop="Account">
                    <el-input v-model="form.Account" v-if="AddUser" placeholder="不能为空"></el-input>
                    <el-input v-model="form.Account" disabled v-else></el-input>
                    <!-- <el-form-item style="color:red" v-else>{{form.name}}</el-form-item>    -->
                </el-form-item>
                <el-form-item label="密码" prop="Password">
                    <el-input v-model="form.Password" placeholder="由8-16位的字母、数字组合"></el-input>
                </el-form-item>
                <el-form-item label="用户类型" prop="AccountType">
                    <el-select v-model="form.AccountType">
                        <el-option key="1" label="普通用户" value="ORDINARY"></el-option>        
                        <el-option key="2" label="技术人员" value="TECHNOLOGY"></el-option>
                        <el-option key="3" label="管理员" value="ADMIN"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开放基站" >
                    <!-- <my-component
                        v-for="(item, index) in form.mountpointList"
                        v-bind:item="item"
                        v-bind:index="index"
                        v-bind:key="index"

                    > 
                    <el-input prop="mountpoint" style="width=30px"></el-input>
                    <el-input prop="vipExpirationDate" style="width=30px"></el-input>
                    </my-component> -->
                    <textarea v-model="mountpointlist" style="width:98%;height:90px;background-color:rgb(255,255,255)" disabled></textarea>
                    <div >
                        <el-input v-model="mountpoint" style="width=30px" placeholder="挂载点"></el-input>
                        <el-select v-model="vipExpirationDate" placeholder="时间" class="handle-select mr10"  @change="currrent2">
                            <el-option v-for="(item,index) in timelist" :key="index" :label="item" :value="index"></el-option>
                        </el-select>  
                        <el-button    type="text" icon="el-icon-lx-roundadd"  @click="AddVIP" style="width:40px">push</el-button><el-button 
                           type="text" icon="el-icon-lx-delete"  @click="DeleteVip">delete</el-button>
                    </div>
                    
             
                    <!-- <el-input v-for="marker in form.mountpointList" :key="marker" :value="marker"></el-input> -->
                </el-form-item>
                <!-- <el-form-item prop="VipExpirationDate" label="到期时间" >
                    <el-input v-model="form.VipExpirationDate" placeholder="例：2019-07-03"></el-input>
                </el-form-item> -->
                <el-form-item label="联系方式" prop="MobilePhone">
                    <el-input v-model="form.MobilePhone" placeholder="输入电话号码"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVis = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit"  :disabled="!checked">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchData } from '../../api/index';
import {isvalidUsername} from '../../utils/validate'
import {validateDate} from '../../utils/validate'
import {validateMobile} from '../../utils/validate'
import axios from 'axios';
import qs from 'qs';
export default {
    name: 'basetable',
    data() {
        const validatePassword=(rule, value, callback)=>{
            console.log(value);
            
            if(value.length<6||value.length>16){
                this.checking.password=false;
                this.check();
                return callback(new Error("密码长度不符合要求"))
                
            }
            else{
                this.checking.password=true;
                this.check();
            }
        }
        
        const validateUsername=(rule,value,callback)=>{
            if(!isvalidUsername(value)){
                this.checking.username=false;
                this.check();
                return callback(new Error("请输入用户名"))
                
            }   
            else{
                this.checking.username=true;
                this.check();
            }
        }
        const validateUserDate=(rule,value,callback)=>{
            console.log(value);
            
            if(!validateDate(value)){
                this.checking.date=false;
                this.check();
                return callback(new Error("请输入正确的日期"))
                
            }
            else{
                this.checking.date=true;
                this.check();
            }
       
        }
        const validateMobilePhone=(rule,value,callback)=>{  
            if(!validateMobile(value)){
                this.checking.phone=false;
                this.check();
                return callback(new Error("请输入正确的手机号"))
                
                
            }
            else{
                this.checking.phone=true;
                this.check();
            }
        }
        const AccountTypes=(rule,value,callback)=>{  
            if(!isvalidUsername(value)){
                this.checking.AccType=false;
                this.check();
                return callback(new Error("不能为空"))
                
            }
            else{
                this.checking.AccType=true;
                this.check();
            }
        }
        return {
            jour:[],       //存放日志信息
            Journal:false,   //显示日志框
            timelist:["3个月","6个月","1年","3年"],
            openmountpoint:false,     //开放基站弹出框
            openmountpointdata:[],     //开放基站信息
            mountpoint:'',
            mountpointlist:'',
            vipExpirationDate:null,
            admin:false,
            tableData: [],
            multipleSelection: [],
            delList: [],
            selectCate: '',
            selectWord: '',
            editVis: false,
            checking:{
                password:false,
                username:false,
                date:false,
                phone:false,
                AccType:false,
            },
            checked:false,
            page: {
                index: 1,
                size: 10,
                total: 100
            },
            form: {},
            idx: -1,
            id: -1,
            title:'',
            AddUser:false,
            loginRules:{
                Account:[{required:true,validator:validateUsername,trigger:'change'}],
                Password:[{required:true,validator:validatePassword,trigger:'change'}],
                // VipExpirationDate:[{required:true,validator:validateUserDate,trigger:'change'}],
                MobilePhone:[{required:true,validator:validateMobilePhone,trigger:"change"}],
                //mobilePhone:[{required:true,validator:validateMobilePhone,trigger:"blur,change"}],
                AccountType:[{required:true,validator:AccountTypes,trigger:'change'}],
            },
        };
    },
    created() {
        this.getData();
        if(localStorage.getItem('ms_usertype')=="ADMIN")
        {
            this.admin=true;
        }
        
    },

    /*
    computed: {
        data() {
            return this.tableData.filter(d => {
                let is_del = false;
                for (let i = 0; i < this.delList.length; i++) {
                    if (d.name === this.delList[i].name) {
                        is_del = true;
                        break;
                    }
                }
                if (!is_del) {
                    if (
                        d.address.indexOf(this.selectCate) > -1 &&
                        (d.name.indexOf(this.selectWord) > -1 || d.address.indexOf(this.selectWord) > -1)
                    ) {
                        return d;
                    }
                }
            });
        }
    },*/
    methods: {
        // 获取 easy-mock 的模拟数据
        
        
        getData() {
            var that=this;
            if(that.page.index==1)
            {
                axios.get(localStorage.getItem('urls')+"api/User/Count").then(function(res){
                    console.log(res.data);
                    that.page.total=res.data.results[0].count;
                })
            }
            axios.get(localStorage.getItem('urls')+"api/User/page",{
                params:{
                pageNum:that.page.index,
                pageSize:that.page.size}
            }).then(function(res){
                console.log(res);
                that.tableData = res.data.results;
                for(var i=0;i<that.tableData.length;i++)
                {
                    that.tableData[i].mountpointdata=[];
                    for(var j=0;j<that.tableData[i].MountpointList.length;j++)
                    { 
                        that.tableData[i].mountpointdata[j]=that.tableData[i].MountpointList[j].Mountpoint+"  "+that.tableData[i].MountpointList[j].ExpirationTime+"到期";
                    }
                }
            })
        },
        //开放基站展开按钮
        handleGGA(index,row){
            console.log("99999");
            this.openmountpoint=true;
            //this.openmountpointdata=row.MountpointList;
            this.openmountpointdata=row.mountpointdata;
            

        },
        //添加用户等弹出框的添加开放基站按钮
        AddVIP(){
            if(this.mountpoint==''||this.vipExpirationDate==null)
            { console.log("666");
                console.log(this.mountpoint);
                console.log(this.vipExpirationDate);
            }
            else
            {
                var flag=false;
                if(this.openmountpointdata.length!=0)
                {
                    console.log("4");
                    for(var i=0;i<this.openmountpointdata.length;i++)
                    {
                        console.log("6");
                        if(this.openmountpointdata[i].Mountpoint==this.mountpoint)
                        {
                            flag=true;
                            console.log("5");
                            var time=this.openmountpointdata[i].ExpirationTime.split('-');
                            console.log(time);
                            console.log(time[0]);
                            if(this.vipExpirationDate==0||this.vipExpirationDate==1){
                                if(this.vipExpirationDate==0){
                                    time[1]=time[1]*1+3;
                                }
                                else{
                                    time[1]=time[1]*1+6;
                                } 
                                if(time[1]>12)
                                {
                                    time[0]=time[0]*1+1;
                                    time[1]=time[1]-12;
                                }
                            }
                            else{
                                if(this.vipExpirationDate==2){
                                    time[0]=time[0]*1+1;
                                }
                                else{
                                    time[0]=time[0]*1+3;
                                }
                            }
                            console.log("444444");
                            console.log(time[0]);
                            console.log(time[1]);

                            this.openmountpointdata[i].ExpirationTime=time[0]+'-'+time[1]+'-'+time[2];
                            this.form.MountpointList=this.openmountpointdata;
                            this.mountpointlist='';
                            for(var i=0;i<this.form.MountpointList.length;i++)
                            {
                                console.log("333");
                                this.mountpointlist= this.form.MountpointList[i].Mountpoint+"  "+this.form.MountpointList[i].ExpirationTime+"到期"+"\n"+this.mountpointlist;
                            }
                            break;
                        }
                    }
                    if(flag==false)
                    {
                       this.NewVip();
                    }
                }
                else
                {
                    this.NewVip();
                }
                
            }
            console.log("88888");
            console.log(this.form.MountpointList);
            
        },
        //添加购买基站和到期时间方法
        NewVip(){
            var date=new Date();
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            var day=date.getDate();
            var hour=date.getHours();
            var minutes=date.getMinutes();
            var seconds=date.getSeconds();
            if(this.vipExpirationDate==0||this.vipExpirationDate==1){
                if(this.vipExpirationDate==0){
                    month=month+3;
                }
                else{
                    month=month+6;
                } 
            }
            else{
                if(this.vipExpirationDate==2){
                    year=year+1;
                }
                else{
                    year=year+3;
                }
            }
            var times=year+'-'+month+'-'+day+' '+hour+':'+minutes+':'+seconds;
            console.log(this.vipExpirationDate);
            this.openmountpointdata.push({
                ExpirationTime:times,
                Mountpoint:this.mountpoint
            })
            this.form.MountpointList=this.openmountpointdata;
            this.mountpointlist='';
            for(var i=0;i<this.form.MountpointList.length;i++)
            {
                console.log("333");
                this.mountpointlist= this.form.MountpointList[i].Mountpoint+"  "+this.form.MountpointList[i].ExpirationTime+"到期"+"\n"+this.mountpointlist;
            }
        },
        //删除顶部基站及到期时间
        DeleteVip(){
            this.openmountpointdata.pop();
            //var len=this.openmountpointdata.length;
            //this.$delete(this.openmountpointdata,len-1);
            this.form.MountpointList=this.openmountpointdata;
            this.mountpointlist='';
            for(var i=0;i<this.form.MountpointList.length;i++)
            {
                console.log("333");
                this.mountpointlist= this.form.MountpointList[i].Mountpoint+"  "+this.form.MountpointList[i].ExpirationTime+"到期"+"\n"+this.mountpointlist;
            }
            

        },
        //验证用户输入无错误执行
        check(){
               if(this.checking.password&&this.checking.username&&this.checking.phone&&this.checking.AccType) 
               {
                   this.checked=true;
               }
               else
               {
                   this.checked=false;
               }
            
        },
        //触发添加用户按钮
        handleAdd(){      
            var that=this;
            that.form={};
            this.checked=false;
            this.title="添加新用户";
            this.AddUser=true
            this.editVis = true;
            /*
            axios.get("http://localhost:5000/",{
                params:{
                    mountpoint:that.form
                }
            }).then(function(res){
                console.log(res);
                that.tableData = res.data;
            })*/
        },
        //移动站日志   已完成
        handlejournal(index,row){
            console.log("55");
            var that=this;
            that.form=row;
            that.jour=[];
                axios.get(localStorage.getItem('urls')+"api/User/NtripClientLogs/"+that.form.Account).then(function(res){
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
                axios.get(localStorage.getItem('urls')+"api/User/UserLogs/"+that.form.Account).then(function(res){
                    console.log(res);
                    for(var i=0;i<res.data.results[0].UserLogs.length;i++)
                    {
                        that.jour.push(res.data.results[0].UserLogs[i].LogTime+res.data.results[0].UserLogs[i].LogMessage);
                    }
                })
            this.Journal=true;
        },
        //返回
        handleBack(){
            this.getData();
         },
        // 触发搜索按钮
        handleSearch() {
            var that=this;
            axios.get(localStorage.getItem('urls')+"api/User/UserInfo/"+that.selectWord).then(function(res){
                console.log(res.data);
                that.tableData = res.data.results;
                    that.tableData[0].mountpointdata=[];
                    for(var j=0;j<that.tableData[0].MountpointList.length;j++)
                    {
                        
                        that.tableData[0].mountpointdata[j]=that.tableData[0].MountpointList[j].Mountpoint+"  "+that.tableData[0].MountpointList[j].ExpirationTime+"到期";
                    }
                
            })
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.form=row;
            var that=this;
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    axios.get(localStorage.getItem('urls')+"api/User/Delete/"+that.form.Account).then(function(res){
                            console.log("操作成功");
                                if(res.data.state==true)
                                {
                                    that.$message.success('删除成功');
                                    that.tableData.splice(index, 1);
                                }
                                else
                                {
                                    console.log(res);
                                    console.log("操作数据库失败");
                                }
                               
                       }).catch(function(error){
                               console.log("连接数据库失败");
                       });
                    
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //删多个
        delAllSelection() {



            var that=this;
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                    const length = that.multipleSelection.length;
                    if(length>0)
                    {
                        let str = this.multipleSelection[0].Account;
                        //this.delList = this.delList.concat(this.multipleSelection);
                        for (let i = 1; i < length; i++) {
                            str =str + ':'+ this.multipleSelection[i].Account;
                        }    
                        console.log(str);
                        axios.post(localStorage.getItem('urls')+"api/User/Delete",
                        qs.stringify({
                            users:str,
                        }), { headers:{ 'Content-Type':'application/x-www-form-urlencoded' }
                        }).then(function(res){
                            console.log(str);
                            console.log(res.data);
                            console.log(res.data.results.length);
                            console.log(length);
                            if(res.data.results.length==length)
                            {
                                that.$message.error(`删除了${str}`);

                            }
                            else
                            {
                                if(res.data.results.length==0)
                                {
                                    that.$message.error(`删除了失败`);
                                }
                                else
                                {
                                    var sss='';
                                    for(var i=0;i<res.data.results.length;i++)
                                    {
                                        console.log("8888");
                                        console.log(str);
                                        sss=sss+res.data.results[i].Account+'/';   
                                    }
                                    that.$message.error(`删除了${sss}`);
                                }
                            }
                            that.getData();
                        })
                    }
                    else
                    {}
                    this.multipleSelection=[];
              }).catch(() => {});
        },
        //显示隐藏密码
        handlepwd(index,row){  
            var dex=document.getElementById(index);
            if(dex.type=="text")
            {
                dex.type="password";
            }
            else
            {
                dex.type="text";
            }
        },
        // 编辑操作
        handleEdit(index, row) {
            this.title="编辑";
            this.AddUser=false;
            this.form={};
            this.idx = index;
            this.id = row.id;
            this.form = JSON.parse(JSON.stringify(row));
            this.openmountpointdata=this.form.MountpointList;
            this.mountpointlist='';
            for(var i=0;i<this.form.MountpointList.length;i++)
            {
                console.log("333");
                this.mountpointlist= this.form.MountpointList[i].Mountpoint+"  "+this.form.MountpointList[i].ExpirationTime+"到期"+"\n"+this.mountpointlist;
            }
            this.editVis = true;
            if(this.form.mountpointList!=null)
            {
                this.form.buycors = this.form.mountpointList.join(',');
            }
            //if(!this.checking.password&&!this.checking.username&&!this.checking.phone&&!this.checking.date&&!this.checking.AccType)
            //{
                  this.checking.password=true;
                  this.checking.username=true;
                  this.checking.phone=true;
                  this.checking.date=true;
                  this.checking.AccType=true;
                  this.checked=true;
            //}
            //else
            //{
            //      this.checked=false;
            //}
            
        },
        // 保存编辑
        saveEdit() {
            this.vipExpirationDate='';
            this.mountpoint='';
            this.mountpointlist='';
            var that=this;
            console.log(this.form);
            this.check();
             console.log(that.form.MountpointList);
            if(this.checked==true)
            {
                this.checked=false;
                this.editVis = false;
                // if(this.form.buycors!=null)
                // {
                //      this.form.mountpointList=this.form.buycors.split(',');
                // }
               
                if(that.AddUser)
                {
                    axios.post(localStorage.getItem('urls')+"api/User/CreateNewUser",
                    qs.stringify({
                        Account:that.form.Account,
                        Password:that.form.Password,
                        AccountType:that.form.AccountType,
                        MountpointList:that.form.MountpointList,
                        MobilePhone:that.form.MobilePhone
                     }), { headers:{ 'Content-Type':'application/x-www-form-urlencoded' }
                     }).then(function(res){ 
                        if(res.data.state){
                            that.$message.success(`添加新用户成功`);
                            //that.tableData.push(that.form);
                            that.$set(that.tableData, 0,that.form);     
                        }
                        else{
                            that.$message.error(`添加新用户失败`);
                        }
                     }).catch(function (error) {
                            console.log(error);
                            that.$message.error(`添加新用户失败`);
                    });           
                }
                else{
                    axios.post(localStorage.getItem('urls')+"api/User/Update/"+that.form.Account,
                    qs.stringify({
                        Account:that.form.Account,
                        Password:that.form.Password,
                        AccountType:that.form.AccountType,
                        MountpointList:that.form.MountpointList,
                        MobilePhone:that.form.MobilePhone
                     }), { headers:{ 'Content-Type':'application/x-www-form-urlencoded' }
                     }).then(function(res){ 
                        if(res.data.state){
                            that.$message.success(`修改第 ${that.idx + 1} 行成功`);
                            that.$set(that.tableData, that.idx, that.form);  
                        }
                        else{
                            that.$message.error(`修改失败`);
                        }
                     }).catch(function (error) {
                            console.log(error);
                            that.$message.error(`修改失败`);
                    });           
                }

                /*
                axios.get(localStorage.getItem('urls'),{
                    params:{
                        changeinf:that.form
                    }
                }).then(function(res){
                    console.log(res);
                    //that.tableData = res.data;
                })*/
            }
            else
            {
                
            }



        },
        // 分页导航
        handlePageChange(val) {
            this.page.index = val;
            this.getData();
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
.search-input {
     outline:none;
     background-color:none;
      border:1px white  solid;
      height: 20px;
      width: 80px;
      margin-top: 5px;
      padding-left: 2px;
      font-size:10px;
     
    
}
.search-input:focus {
  outline:none;
  border:1px white  solid;
}

</style>
