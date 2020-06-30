<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <div class="logo">后台管理系统</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- 消息中心 -->
                <div class="btn-bell" @click="totab">
                    <el-tooltip
                        effect="dark"
                        :content="(inf.length)?`有${inf.length}条未读消息`:`消息中心`"
                        placement="bottom"
                        
                    >
                        <router-link to="/tabs">
                            <i class="el-icon-bell"></i>
                        </router-link>
                        
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="inf.length"></span>
                </div>
                <!-- 用户头像 -->
                <div class="user-avator">
                    <img src="../../assets/img/img.jpg" />
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item divided command="changepwd">修改密码</el-dropdown-item>
                        <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <!-- 修改密码弹出框 -->
        <el-dialog :title="title"  :visible.sync="password" width="22%">
            <el-form ref="form" :rules="loginRules" :model="form" label-width="80px">
                <el-form-item label="用户名" prop="Account">
                    <el-input v-model="form.Account" disabled></el-input>
                   
                    <!-- <el-form-item style="color:red" v-else>{{form.name}}</el-form-item>    -->
                </el-form-item>
                <el-form-item label="原密码" prop="Password">
                    <el-input v-model="form.OldPassword" placeholder="由8-16位的字母、数字组合"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="Password">
                    <el-input v-model="form.NewPassword" placeholder="由8-16位的字母、数字组合"></el-input>
                </el-form-item>
                <el-form-item label="重复密码" prop="Password">
                    <el-input v-model="form.New2Password" placeholder="由8-16位的字母、数字组合"></el-input>
                </el-form-item>
                <el-form-item style="color:red" v-show="arror">{{arrorinf}}</el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="password = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import bus from '../common/bus';
import * as signalR from '@aspnet/signalr';
import vm from '../../utils/utils.js';
export default {
    data() {
        return {
            arror:false,
            arrorinf:'',
            form:{},
            password:false,
            collapse: false,
            fullscreen: false,
            name: 'linxin',
            message: 0,
            inf:[],
        };
    },
    computed: {
        username() {
            let username = localStorage.getItem('ms_username');
            return username ? username : this.name;
        },
        
    },
    methods: {
        totab(){
            console.log("jjj");
            vm.$emit('totab', "str2[1]");
        },
        Receive(message){
            var str2=message.split(':');
            vm.$emit('caster', str2[1]);
        },
        ReceiveMessage(str){
            console.log(str);
            var that=this;
            //console.log("dd");
            //console.log(message);
            //that.$message.success(message);
            var date=new Date();
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            var day=date.getDate();
            var hour=date.getHours();
            var minutes=date.getMinutes();
            var seconds=date.getSeconds();
            var times=year+'-'+month+'-'+day+' '+hour+':'+minutes+':'+seconds;
            //that.$message.error(str);
            
            var str2=str.split(':');
            if(str2[0]=="Caster")
            {
                vm.$emit('caster', str2[1]);
            }

            if(str2[1]=="True")
            {

                var str3=str2[0]+"已上线";
                this.$message.success(str3);
            }
            else
            {
                var str3=str2[0]+"已掉线";
                this.$message.error(str3);
            }
            if(str2[0]!="Caster")
            {
                vm.$emit('toequipment', str);
            }
            that.inf.push({
                title:str3,
                date:times,
                state:false,
            });
            localStorage.setItem('inf', JSON.stringify(this.inf));
            console.log("connected");

        },
        
        //修改密码
        saveEdit(){
            var that=this;
            if(this.form.OldPassword==null||this.form.NewPassword==null||this.form.NewPassword==null)
            {
                this.arror=true;
                this.arrorinf="不能为空";
            }
            else if(this.form.NewPassword!=this.form.NewPassword)
            {
                this.arror=true;
                this.arrorinf="重复密码不一致";
            }
            else
            {
                
                axios.get(localStorage.getItem('urls')+"api/Basestation/page",{
                    params: {
                    pageNum:that.page.index,
                    pageSize:that.page.size}
                }).then(function(res){
                    if(res.data==false)
                    {
                        that.arror=true;
                        that.arrorinf="旧密码错误";
                    }
                    else
                    {
                        that.password=false;
                        that.arror=false;
                        that.$message.success('修改密码成功');
                    }
                })
            }
        },
        // 用户名下拉菜单选择事件
        handleCommand(command) {
            if (command == 'loginout') {
 
                 window.onbeforeunload = function (e) {
                    var storage = window.localStorage;
                    storage.clear()
                }
                localStorage.removeItem('ms_username');
                localStorage.removeItem('ms_usertype');
                this.$router.push('/login');
            }
            if(command == 'changepwd') {
                
                this.changepassword();
            }
        },
        changepassword(){
            this.password=true;
        },
        // 侧边栏折叠
        collapseChage() {
            this.collapse = !this.collapse;
            bus.$emit('collapse', this.collapse);
        },
        // 全屏事件
        handleFullScreen() {
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        }
    },
    mounted() {
        //var vm = new Vue()
        var that=this;
        //localStorage.setItem('inf', JSON.stringify(this.inf));
    //    setInterval(function(){
    //         that.inf = JSON.parse(localStorage.getItem('inf'));
    //         console.log("555");
    //    },5000);
        console.log("852");
        vm.$on('test', function (msg) {
          that.inf = JSON.parse(localStorage.getItem('inf'));
         })
         //that.inf = JSON.parse(localStorage.getItem('inf'));

        //if(localStorage.getItem('ms_usertype')=="ADMIN"||localStorage.getItem('ms_usertype')=="TECHNOLOGY")
        //{
            const connection = new signalR.HubConnectionBuilder()
            .withUrl("http://127.0.0.1:5000/" + "hub")
            .configureLogging(signalR.LogLevel.Information)
            .build();
            connection.on("ReceiveMessage", (message) => {
                //console.log(message);
                that.ReceiveMessage(message);
                // const encodedMsg =  " says " + message;
                // const li = document.createElement("li");
                // li.textContent = encodedMsg;
                // document.getElementById("messagesList").appendChild(li);
            });
            connection.on("GetCasterState", (message) => {
                //console.log(message);
                that.Receive(message);
                // const encodedMsg =  " says " + message;
                // const li = document.createElement("li");
                // li.textContent = encodedMsg;
                // document.getElementById("messagesList").appendChild(li);
            });
            connection.start().then(function () {
                console.log("asdas");
                console.log(connection);
                connection.invoke("GetCasterState").catch(err => console.error(err.toString()));
            });
        //}
        /*
        else
        {
            var that=this;
            axios.get(localStorage.getItem('urls')+"api/User/UserInfo/"+localStorage.getItem('ms_username')).then(function(res){
                console.log(res);
                var database=res.data.results[0].MountpointList;
                const length = database.length;
                if(length>0)
                {
                    var str = database[0].Mountpoint;
                            //this.delList = this.delList.concat(this.multipleSelection);
                    for (let i = 1; i < length; i++) {
                        str =str + ':'+ database[i].Mountpoint;
                    }
                    const connection = new signalR.HubConnectionBuilder()
                    .withUrl(localStorage.getItem('urls') + "hub")
                    .configureLogging(signalR.LogLevel.Information)
                    .build();
                    connection.on("ReceiveMessage", (message) => {
                        //console.log(message);
                        that.ReceiveMessage(message);
                        // const encodedMsg =  " says " + message;
                        // const li = document.createElement("li");
                        // li.textContent = encodedMsg;
                        // document.getElementById("messagesList").appendChild(li);
                    });
                    connection.start().then(function () {
                        console.log("asdas");
                        console.log(connection);
                        connection.invoke("Send", str).catch(err => console.error(err.toString()));
                    });
                }
            })




        }*/


        
       
    }
};
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.header .logo {
    float: left;
    width: 250px;
    line-height: 70px;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-bell {
    color: #fff;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
</style>
