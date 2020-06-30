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
                <el-select v-model="selectCate" placeholder="筛选省份" class="handle-select mr10" @change="currentSel">
                    <!-- <el-option  label=null value=""></el-option> -->
                    <el-option v-for="(item,index) in pros" :key="index" :label="item" :value="index"></el-option>
                    
                </el-select>
                <el-select v-model="select" placeholder="筛选市" class="handle-select mr10" @change="current">
                    <el-option v-for="(item,index) in citylist" :key="index" :label="item" :value="item"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-delete" @click="handledelececity">清空</el-button>
                <el-input v-model="selectWord" placeholder="输入挂载点名称" class="handle-input mr10" style="margin-left: 10px"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" class="el-icon-lx-add" @click="handleAdd" v-if="admin"> 添加新基站</el-button>
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
                <el-table-column prop="Mountpoint" label="挂载点" align="center"></el-table-column>
                <el-table-column prop="LoginName" label="基站名" align="center"></el-table-column>
                <el-table-column label="密码" class="search-box" width="120" align="center">
                    <!-- {{scope.row.loginPassword}} -->
                    <template slot-scope="scope">   
                         <input  class="search-input" :id="scope.$index" type="password" :value="scope.row.LoginPassword"  style="float:left"/><el-button  
                            type="text"
                            icon="el-icon-lx-attention"
                            @click="handlepwd(scope.$index, scope.row)"
                        ></el-button> 
                    </template>
                        <!-- <button  style="float:right;color:blue" v-on:click="searchinf"
                            type="text"
                            class="el-icon-lx-attention"
                            @click="handleEdit(scope.$index, scope.row)"
                        
                        ></button>       -->
                        <!-- <el-input  class="search-input" type="password" value="wqewe"  style="float:left" />                  
                        <el-button class="search-button" style="float:right" v-on:click="searchinf"
                            type="text"
                            icon="el-icon-lx-attention"
                            @click="handleEdit(scope.$index, scope.row)"
                        >展开</el-button>  -->
                    
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.IsOnline===true?'success':(scope.row.IsOnline===false?'danger':'')"
                        >{{scope.row.IsOnline}}</el-tag>
                    </template>
                </el-table-column>
               
                <el-table-column prop="City" label="地址" align="center"></el-table-column>
                

                <el-table-column prop="CreateTime" label="注册时间" align="center"></el-table-column>
                <el-table-column prop="LinkMan" label="联系人" align="center"></el-table-column>
                <el-table-column prop="ContactNumber" label="联系方式" align="center"></el-table-column>
                <el-table-column prop="OnlinePercent" label="在线率" align="center"></el-table-column>
                <el-table-column prop="GGA" label="源数据" width="70px" align="center">
                     <template slot-scope="scope">
                    <el-button
                            type="text"
                            icon="el-icon-lx-attention"
                            @click="handleGGA(scope.$index, scope.row)"
                        >展开</el-button>
                </template>
                </el-table-column>
               
                <el-table-column label="操作" width="160" align="center" v-if="admin">
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
                 <el-table-column label="日志" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text" 
                            class="el-icon-lx-text"
                            style="color:blue"
                            @click="handlejournal(scope.$index, scope.row)"
                        >打开</el-button>
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
  
        <!-- 源数据信息弹出框 -->
        <el-dialog title="源数据" :visible.sync="editGAA" width="700px">
            <el-form ref="form" :model="form" :rules="loginRules" label-width="40%">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="类型：">
                            <el-span style="color:red">{{form.Type}}</el-span>
                         </el-form-item>
                        
                     </el-col>
                    <el-col :span="12">
                        <el-form-item label="identifier：">
                            <el-span style="color:red">{{form.Identifier}}</el-span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="挂载点：">
                    <!-- <el-input v-model="form.mountpoint" class="elinput" type="text"></el-input> -->
                            <el-span style="color:red">{{form.Mountpoint}}</el-span>
                         </el-form-item>
                        
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="差分数据格式：">
                            <el-span style="color:red">{{form.RTCMFormat}}</el-span>
                        </el-form-item>
                        
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="数据发送频率：">
                            <el-span style="color:red">{{form.IntervalTime}}</el-span>
                        </el-form-item>
                   
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="载波相位数据：">
                            <el-span style="color:red">{{form.CarrierPhaseData}}</el-span>
                        </el-form-item>
                        
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="导航系统：">
                            <el-span style="color:red">{{form.GuidanceSystem}}</el-span>
                        </el-form-item>
                        
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="网络：">
                            <el-span style="color:red">{{form.NetworkType}}</el-span>
                        </el-form-item>
                        
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="国家：">
                            <el-span style="color:red">{{form.Country}}</el-span>
                        </el-form-item>
                        
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="纬度：">
                            <el-span style="color:red">{{form.Latitude}}</el-span>
                        </el-form-item>
                        
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="经度：">
                            <el-span style="color:red">{{form.Longitude}}</el-span>
                        </el-form-item>
                        
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="发送NMEA：">
                            <el-span style="color:red">{{form.NeedNMEA}}</el-span>
                        </el-form-item>
                       
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                         <el-form-item label="基站类型：">
                             <el-span style="color:red">{{form.BasetationType}}</el-span>
                        </el-form-item>
                        
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="软件名称：">
                            <el-span style="color:red">{{form.NameOfSoftware}}</el-span>
                        </el-form-item>
                        
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="压缩算法：">
                            <el-span style="color:red">{{form.CompactionAlgorithm}}</el-span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="访问保护：">
                            <el-span style="color:red">{{form.VisitProtectType}}</el-span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="Y/N：">
                            <el-span style="color:red">{{form.YORN}}</el-span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="比特率：">
                            <el-span style="color:red">{{form.Bitrate}}</el-span>
                        </el-form-item>
                    </el-col>
                </el-row>

  

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editGAA = false">取 消</el-button>
               
            </span>
        </el-dialog>


        <!-- 编辑添加弹出框 -->
        <el-dialog :title="title" :visible.sync="editVisible" width="400px">
            <el-form ref="form" :model="form" :rules="loginRules" label-width="80px">
                <el-form-item label="基站名" prop="LoginName">
                    <el-input v-model="form.LoginName" class="elinput" placeholder="不能为空"></el-input>
                    
                </el-form-item>
                <el-form-item label="密码" prop="LoginPassword">
                    <el-input v-model="form.LoginPassword" class="elinput" placeholder="由8-16位的字母、数字组合"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="LinkMan">
                    <el-input v-model="form.LinkMan" class="elinput" placeholder="不能为空"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="ContactNumber">
                    <el-input v-model="form.ContactNumber" class="elinput" placeholder="输入电话号码"></el-input>
                </el-form-item >
                <el-form-item label="省市">
                    <el-select v-model="form.Province" placeholder="省" class="handle-select mr10" @change="currentSel2">
                        <el-option v-for="(item,index) in pros" :key="index" :label="item" :value="index"></el-option>
                    </el-select>
                    <el-select v-model="form.City" placeholder="市" class="handle-select mr10" @change="currrent2">
                        <el-option v-for="(item,index) in citylist" :key="index" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item >
                <el-form-item label="源数据">
                    <el-select v-model="form.Type" placeholder="类型" class="handle-select mr10" >
                        <el-option key="1" label="STR" value="STR"></el-option>
                        <el-option key="2" label="CAS" value="CAS"></el-option>
                        <el-option key="3" label="NET" value="NET"></el-option>
                    </el-select>
                  
                    <el-input v-model="form.Mountpoint" v-show="AddMountpoint"  placeholder="挂载点" class="elinput"></el-input>
                    <el-input disabled v-model="form.Mountpoint" v-show="!AddMountpoint" class="elinput"></el-input>
                    <el-input v-model="form.Identifier" placeholder="identifier" class="elinput"></el-input>
                    <el-select v-model="form.RTCMFormat" placeholder="差分数据格式" class="handle-select mr10">
                        <el-option key="1" label="RTCM2.3" value="RTCM2.3"></el-option>        
                        <el-option key="2" label="RTCM3.0" value="RTCM3.0"></el-option>
                        <el-option key="3" label="CMR" value="CMR"></el-option>
                    </el-select>
                    <el-input v-model="form.IntervalTime" placeholder="数据发送频率 例:3(10)代表10秒发3次" class="elinput"></el-input>
                    <el-select v-model="form.CarrierPhaseData" placeholder="载波相位数据" class="handle-select mr10">
                        <el-option key="1" label="0--无" value=0></el-option>        
                        <el-option key="2" label="1--单频" value=1></el-option>
                        <el-option key="3" label="2--双频" value=2></el-option>
                    </el-select>
                    <!-- <el-select v-model="form.GuidanceSystem" placeholder="导航系统" class="handle-select mr10" multiple>
                        <el-option key="1" label="GPS" value="GPS"></el-option>        
                        <el-option key="2" label="GLO" value="GLO"></el-option>
                        <el-option key="3" label="BDS" value="BDS"></el-option>
                    </el-select> -->
                    <el-select v-model="form.GuidanceSystem" placeholder="导航系统" class="handle-select mr10">
                        <el-option key="1" label="GPS" value="GPS"></el-option>        
                        <el-option key="2" label="GLO" value="GLO"></el-option>
                        <el-option key="3" label="BDS" value="BDS"></el-option>
                    </el-select>
                    <el-select v-model="form.NetworkType" placeholder="网络" class="handle-select mr10">
                        <el-option key="1" label="SGNET" value="SGNET"></el-option>        
                    </el-select>
                    <el-select v-model="form.Country" placeholder="国家" class="handle-select mr10">
                        <el-option key="1" label="CHN--中国" value="CHN"></el-option>        
                    </el-select>
                    <el-input v-model="form.Latitude" placeholder="纬度" class="elinput"></el-input>
                    <el-input v-model="form.Longitude" placeholder="经度" class="elinput"></el-input>
                    <el-select v-model="form.NeedNMEA" placeholder="发送NMEA" class="handle-select mr10">
                        <el-option key="1" label="0--不需要" value=0></el-option>   
                        <el-option key="2" label="1--需要" value=1></el-option>       
                    </el-select>
                    <el-select v-model="form.BasetationType" placeholder="基站类型" class="handle-select mr10">
                        <el-option key="1" label="0--单基站" value=0></el-option>   
                        <el-option key="2" label="1--网络" value=1></el-option>       
                    </el-select>
                    <el-input v-model="form.NameOfSoftware" placeholder="软件名称" class="elinput"></el-input>
                    <el-select v-model="form.CompactionAlgorithm" placeholder="压缩算法" class="handle-select mr10">
                        <el-option key="1" label="None--无" value="None"></el-option>        
                    </el-select>
                    <el-select v-model="form.VisitProtectType" placeholder="访问保护" class="handle-select mr10">
                        <el-option key="1" label="N—None" value="N"></el-option>        
                        <el-option key="2" label="B—Basic" value="B"></el-option>
                        <el-option key="3" label="D—Digest" value="D"></el-option>
                    </el-select>
                    <el-select v-model="form.YORN" placeholder="Y/N" class="handle-select mr10">
                        <el-option key="1" label="Y" value="Y"></el-option>   
                        <el-option key="2" label="N" value="N"></el-option>       
                    </el-select>
                    <el-input v-model="form.Bitrate" placeholder="比特率" class="elinput"></el-input>
                    <!-- <el-input v-model="arrorinf" v-show="arror" type="text" style="color:red"></el-input> -->
                    <el-form-item style="color:red" v-show="arror">{{arrorinf}}</el-form-item>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit" :disabled="!checked">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchData } from '../../api/index';
import {isvalidUsername} from '../../utils/validate';
import {VerSource}from '../../utils/validate';
import {validateMobile} from '../../utils/validate';
import axios from 'axios';
import qs from 'qs';
import vm from '../../utils/utils.js';
export default {
    name: 'basetable',
    data() {
       const LoginNames=(rule,value,callback)=>{
            if(!isvalidUsername(value)){
                this.checking.username=false;
                this.check();
                return callback(new Error("用户名不能为空"))
            }   
            else{
                this.checking.username=true;
                this.check();
            }

        }
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
        
        const TechnicianPersons=(rule,value,callback)=>{
            if(!isvalidUsername(value)){
                this.checking.tecperson=false;
                this.check();
                return callback(new Error("联系人不能为空"))
            }   
            else{
                this.checking.tecperson=true;
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
        return {
            jour:[],       //存放日志信息
            Journal:false,   //显示日志框
            admin:false,      //是否是管理员
            editGAA:false,
            zhixiashi:false,   //是否是直辖市
            tableData: [],
            multipleSelection: [],
            delList: [],
            citylist:[],
            selectCate: '',
            selectWord: '',
            select:'',
            AddMountpoint:false,
            title:'',
            editVisible: false,
            checking:{
                password:false,
                username:false,
                tecperson:false,
                phone:false,
            },
            checked:false,
            page: {
                index: 1,
                size: 10,
                total: 50
            },
            form: {},
            idx: -1,
            id: -1,
            arror:false,
            arrorinf:'',
            pros : ["北京","天津","上海","重庆","河北省","山西省","辽宁省","吉林省","黑龙江省","江苏省","浙江省","安徽省","福建省","江西省","山东省","河南省","湖北省","湖南省","广东省","海南省","四川省","贵州省","云南省","陕西省","甘肃省","青海省","内蒙古","广西","西藏","宁夏","新疆","香港","澳门","台湾"],
            citys : [["东城区","西城区","崇文区","宣武区","朝阳区","海淀区","丰台区","石景山区","房山区","通州区","顺义区","昌平区","大兴区","怀柔区","平谷区","门头沟区","密云县","延庆县"],["和平区","河东区","河西区","南开区","河北区","红桥区","东丽区","西青区","北辰区","津南区","武清区","宝坻区","滨海新区","静海县","宁河县","蓟县"],["黄浦区","卢湾区","徐汇区","长宁区","静安区","普陀区","闸北区","虹口区","杨浦区","闵行区","宝山区","嘉定区","浦东新区","金山区","松江区","青浦区","奉贤区","崇明县"],["渝中区","大渡口区","江北区","南岸区","北碚区","渝北区","巴南区","长寿区","双桥区","沙坪坝区","万盛区","万州区","涪陵区","黔江区","永川区","合川区","江津区","九龙坡区","南川区","綦江县","潼南县","荣昌县","璧山县","大足县","铜梁县","梁平县","开县","忠县","城口县","垫江县","武隆县","丰都县","奉节县","云阳县","巫溪县","巫山县","石柱土家族自治县","秀山土家族苗族自治县","酉阳土家族苗族自治县","彭水苗族土家族自治县"],["石家庄","唐山","秦皇岛","邯郸","邢台","保定","张家口","承德","沧州","廊坊","衡水"],["太原","大同","阳泉","长治","晋城","朔州","晋中","运城","忻州","临汾","吕梁"],["沈阳","大连","鞍山","抚顺","本溪","丹东","锦州","营口","阜新","辽阳","盘锦","铁岭","朝阳","葫芦岛"],["长春","吉林","四平","辽源","通化","白山","松原","白城","延边朝鲜族自治州"],["哈尔滨","齐齐哈尔","鹤岗","双鸭山","鸡西","大庆","伊春","牡丹江","佳木斯","七台河","黑河","绥化","大兴安岭"],["南京","苏州","无锡","常州","镇江","南通","泰州","扬州","盐城","连云港","徐州","淮安","宿迁"],["杭州","宁波","温州","嘉兴","湖州","绍兴","金华","衢州","舟山","台州","丽水"],["合肥","芜湖","蚌埠","淮南","马鞍山","淮北","铜陵","安庆","黄山","滁州","阜阳","宿州","巢湖","六安","亳州","池州","宣城"],["福州","厦门","莆田","三明","泉州","漳州","南平","龙岩","宁德"],["南昌","景德镇","萍乡","九江","新余","鹰潭","赣州","吉安","宜春","抚州","上饶"],["济南","青岛","淄博","枣庄","东营","烟台","潍坊","济宁","泰安","威海","日照","莱芜","临沂","德州","聊城","滨州","菏泽"],["郑州","开封","洛阳","平顶山","安阳","鹤壁","新乡","焦作","濮阳","许昌","漯河","三门峡","南阳","商丘","信阳","周口","驻马店"],["武汉","黄石","十堰","荆州","宜昌","襄樊","鄂州","荆门","孝感","黄冈","咸宁","随州","恩施"],["长沙","株洲","湘潭","衡阳","邵阳","岳阳","常德","张家界","益阳","郴州","永州","怀化","娄底","湘西"],["广州","深圳","珠海","汕头","韶关","佛山","江门","湛江","茂名","肇庆","惠州","梅州","汕尾","河源","阳江","清远","东莞","中山","潮州","揭阳","云浮"],["海口","三亚"],["成都","自贡","攀枝花","泸州","德阳","绵阳","广元","遂宁","内江","乐山","南充","眉山","宜宾","广安","达州","雅安","巴中","资阳","阿坝","甘孜","凉山"],["贵阳","六盘水","遵义","安顺","铜仁","毕节","黔西南","黔东南","黔南"],["昆明","曲靖","玉溪","保山","昭通","丽江","普洱","临沧","德宏","怒江","迪庆","大理","楚雄","红河","文山","西双版纳"],["西安","铜川","宝鸡","咸阳","渭南","延安","汉中","榆林","安康","商洛"],["兰州","嘉峪关","金昌","白银","天水","武威","酒泉","张掖","庆阳","平凉","定西","陇南","临夏","甘南"],["西宁","海东","海北","海南","黄南","果洛","玉树","海西"],["呼和浩特","包头","乌海","赤峰","通辽","鄂尔多斯","呼伦贝尔","巴彦淖尔","乌兰察布","锡林郭勒盟","兴安盟","阿拉善盟"],["南宁","柳州","桂林","梧州","北海","防城港","钦州","贵港","玉林","百色","贺州","河池","来宾","崇左"],["拉萨","那曲","昌都","林芝","山南","日喀则","阿里"],["银川","石嘴山","吴忠","固原","中卫"],["乌鲁木齐","克拉玛依","吐鲁番","哈密","和田","阿克苏","喀什","克孜勒苏","巴音郭楞","昌吉","博尔塔拉","伊犁","塔城","阿勒泰"],["香港岛","九龙东","九龙西","新界东","新界西"],["澳门半岛","离岛"],["台北","高雄","基隆","新竹","台中","嘉义","台南市"]],
           // selectCity:citys.selectWord,
           loginRules:{
                LoginName:[{required:true,validator:LoginNames,trigger:'change'}],
                //LoginName:[{required:true,message:"不能为空",trigger:'blur'}],
                LoginPassword:[{required:true,validator:validatePassword,trigger:'change'}],
                LinkMan:[{required:true,validator:TechnicianPersons,trigger:'change'}],
                ContactNumber:[{required:true,validator:validateMobilePhone,trigger:'change'}],
            },
        };
    },
    created() {
        this.getData();
        if(localStorage.getItem('ms_usertype')=="ADMIN")
        {
            this.admin=true;
        }
        else{
            this.admin=false;
        }
        var that=this;
        vm.$on('toequipment', function (msg) {
            console.log("661");
           var str=msg.split(':');
           console.log(msg);
           console.log(str[0]);
           for(var i=0;i<that.tableData.length;i++)
           {
               console.log("11");
               console.log(that.tableData[i].Mountpoint);
               if(that.tableData[i].Mountpoint==str[0])
               {
                   console.log("21");
                   if(str[1]=="True")
                   {
                       console.log("31");
                       that.tableData[i].IsOnline=true;
                   }
                   else
                   {
                       console.log("141");
                       that.tableData[i].IsOnline=false;
                   }
                   //this.tableData=this.tableData
               }
           }
         })
        
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
                axios.get(localStorage.getItem('urls')+"api/Basestation/Count").then(function(res){
                    console.log(res.data);
                    that.page.total=res.data.results[0].count;
                })

            }
            
            
            axios.get(localStorage.getItem('urls')+"api/Basestation/page",{
                params: {
                pageNum:that.page.index,
                pageSize:that.page.size}
            }).then(function(res){
                console.log(res);
                that.tableData = res.data.results;
            })
                
            
        },
        //验证用户输入基本信息无错误执行
        check(){
         
               if(this.checking.password&&this.checking.username&&this.checking.phone&&this.checking.tecperson) 
               {
                   this.checked=true;
               }
               else
               {
                   this.checked=false;
               }
            
        },
        //选择省份执行
        currentSel(res){
            console.log(res);
            var i=res;
            this.selectCate=this.pros[i];
            this.form.Province=this.pros[i];  //将编辑框省份由数字改为省份名
            if(i==0||i==1||i==2||i==3)
            {
                this.zhixiashi=true;
                this.citylist=[this.pros[i]];
            }
            else
            {
                this.zhixiashi=false;
                this.citylist=this.citys[i];
            }
            this.select='';
               
            this.form.City='';                 //选中省份清空市
        },
        //编辑框选择省份执行
        currentSel2(res){
            
            console.log(res);
            var i=res;
            this.form.Province=this.pros[i];  //将编辑框省份由数字改为省份名
            if(i==0||i==1||i==2||i==3)
            {
                this.zhixiashi=true;
                this.citylist=[this.pros[i]];
            }
            else
            {
                this.zhixiashi=false;
                this.citylist=this.citys[i];
            }      
            //  this.form.City='';               //选中省份清空市
        },
        //选择市执行

        current(res){
            //写按地区搜索
            //省：selectCate
            //市：select
            console.log(this.selectCate);
            if(!this.zhixiashi)
            {
                console.log("555");
                this.select=this.select+"市";
            }
            this.page.index = 1;
            this.citygetdata();

        },
        //编辑框选择市执行
        currrent2(res){
            //this.form.City=res;
            
            if(!this.zhixiashi)
            {
                this.form.City=this.form.City+"市";
                //this.form.City="市";
            }
        },
        //根据市请求数据
        citygetdata(){
            var that=this;
            if(this.page.index == 1)
            {
                axios.get(localStorage.getItem('urls')+"api/Basestation/Count/"+this.select).then(function(res){
                    console.log(res.data);
                    that.page.total=res.data.results[0].count;
                })
            }
            
            axios.get(localStorage.getItem('urls')+"api/Basestation/PageByCity",{
                params:{
                    city:that.select,
                    pageNum:that.page.index,
                    pageSize:that.page.size
                }
            }).then(function(res){
                console.log(res);
                that.tableData = res.data.results;
                if(that.page.index==1)
                {
                    that.page.total=res.data.total;
                }
            })
        },
        //查看在线率
        handleinline(index,row){

        },
        //清空省市

        handledelececity(){
            this.selectCate='';
            this.select='';
            this.page.index = 1;
            this.getData();
        },
        //源数据展开框
        handleGGA(index, row){
            this.form = row;
            this.editGAA=true;

        },
         //触发添加用户按钮
        handleAdd(){
            var that=this;
            that.form={};
            this.title="添加新基站";
            this.checking.password=false;
            this.checking.username=false;
            this.checking.phone=false;
            this.checking.tecperson=false;
            this.checked=false;
            this.AddMountpoint=true
            this.editVisible = true;
        },
        // 触发搜索按钮
        handleSearch() {
            var that=this;
            if(that.selectWord=='')
            {
                //that.handledelececity();
            }
            else
            {
                 axios.get(localStorage.getItem('urls')+"api/Basestation/"+that.selectWord).then(function(res){
                    console.log(res);
                    that.tableData = res.data.results; 
                 })
            }
           
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            var that=this;
            that.form=row;
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                    axios.get(localStorage.getItem('urls')+"api/Basestation/Delete/"+that.form.Mountpoint).then(function(res){
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
            var that=this;
            this.multipleSelection = val;
        },
        //删多个
        delAllSelection() {
            var that=this;
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                    const length = this.multipleSelection.length;
                    if(length>0)
                    {
                        let str = this.multipleSelection[0].Mountpoint;
                        //this.delList = this.delList.concat(this.multipleSelection);
                        for (let i = 1; i < length; i++) {
                            str =str + ':'+ this.multipleSelection[i].Mountpoint;
                        }
                    
                                
                        axios.post(localStorage.getItem('urls')+"api/Basestation/Delete",
                        qs.stringify({
                            mountpoints:str,
                        }), { headers:{ 'Content-Type':'application/x-www-form-urlencoded' }
                        }).then(function(res){
                            console.log(res.data);
                            if(res.data.mountpointList.length==length)
                            {
                                that.$message.error(`删除了${str}`);
                                /*
                                for(var i=0;i<that.multipleSelection.length;i++)
                                {
                                    for(var j=0;j<that.tableData.length;j++)
                                    {
                                        if(that.multipleSelection[i].Mountpoint==that.tableData[j].Mountpoint)
                                        {
                                            that.$delete(that.tableData, j);
                                        }
                                    }
                                }*/
                                
                                //getData();
                                //this.multipleSelection = [];
                            }
                            else
                            {
                                if(res.data.mountpointList.length==0)
                                {
                                    that.$message.error(`删除了失败`);
                                }
                                else
                                {
                                    var sss='';
                                    for(var i=0;i<res.data.mountpointList.length;i++)
                                    {
                                        sss=sss+res.data.mountpointList[i]+'/';
                                        
                                    }
                                    that.$message.error(`删除了${sss}`);
                                    
                                }
                                
                                //console.log(res);
                                //console.log("操作数据库失败");
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
            this.form=JSON.parse(JSON.stringify({}));
            this.title="编辑";
            this.AddMountpoint=false;  
            this.idx = index;
            this.id = row.id;
            this.form = JSON.parse(JSON.stringify(row));
            this.editVisible = true;
            this.checked=true;

            //if(!this.checking.password&&!this.checking.username&&!this.checking.phone&&!this.checking.tecperson)
            //{
                  this.checking.password=true;
                  this.checking.username=true;
                  this.checking.phone=true;
                  this.checking.tecperson=true;
                  this.checked=true;
            //}
            //else
            //{
            //      this.checked=false;
            //}
        },
        // 保存编辑
        saveEdit() {
            console.log("5");
            var that=this;
   
            var ret=VerSource(that.form);
            if(ret!=true)
            {
                
                this.arrorinf=ret;
                this.arror=true;
            }
            else
            {
                console.log("4");
                this.editVisible = false;
                if(that.AddMountpoint)
                {
                    console.log("6");
                    axios.post(localStorage.getItem('urls')+"api/Basestation/CreateNewBasestation",
                    qs.stringify({
                        Type:that.form.Type,
                        Mountpoint:that.form.Mountpoint,
                        Identifier:that.form.Identifier,
                        RTCMFormat:that.form.RTCMFormat,
                        IntervalTime:that.form.IntervalTime,
                        CarrierPhaseData:that.form.CarrierPhaseData,
                        GuidanceSystem:that.form.GuidanceSystem,
                        NetworkType:that.form.NetworkType,
                        Country:that.form.Country,
                        Province:that.form.Province,
                        City:that.form.City,
                        Longitude:that.form.Longitude,
                        Latitude:that.form.Latitude,
                        NeedNMEA:that.form.NeedNMEA,
                        BasetationType:that.form.BasetationType,
                        NameOfSoftware:that.form.NameOfSoftware,
                        CompactionAlgorithm:that.form.CompactionAlgorithm,
                        VisitProtectType:that.form.VisitProtectType,
                        YORN:that.form.YORN,
                        Bitrate:that.form.Bitrate,
                        LoginName:that.form.LoginName,
                        LoginPassword:that.form.LoginPassword,
                        //IsOnline:that.form.
                        //Logs:that.form.Logs
                        LinkMan:that.form.LinkMan,
                        ContactNumber:that.form.ContactNumber,
                        //CreateTime:that.form.
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
                    axios.post(localStorage.getItem('urls')+"api/Basestation/Update/"+that.form.Mountpoint,
                    qs.stringify({
                        Type:that.form.Type,
                        Mountpoint:that.form.Mountpoint,
                        Identifier:that.form.Identifier,
                        RTCMFormat:that.form.RTCMFormat,
                        IntervalTime:that.form.IntervalTime,
                        CarrierPhaseData:that.form.CarrierPhaseData,
                        GuidanceSystem:that.form.GuidanceSystem,
                        NetworkType:that.form.NetworkType,
                        Country:that.form.Country,
                        Province:that.form.Province,
                        City:that.form.City,
                        Longitude:that.form.Longitude,
                        Latitude:that.form.Latitude,
                        NeedNMEA:that.form.NeedNMEA,
                        BasetationType:that.form.BasetationType,
                        NameOfSoftware:that.form.NameOfSoftware,
                        CompactionAlgorithm:that.form.CompactionAlgorithm,
                        VisitProtectType:that.form.VisitProtectType,
                        YORN:that.form.YORN,
                        Bitrate:that.form.Bitrate,
                        LoginName:that.form.LoginName,
                        LoginPassword:that.form.LoginPassword,
                        //IsOnline:that.form.
                        //Logs:that.form.Logs
                        LinkMan:that.form.LinkMan,
                        ContactNumber:that.form.ContactNumber,
                        //CreateTime:that.form.
                    }), { headers:{ 'Content-Type':'application/x-www-form-urlencoded' }
                    }).then(function(res){ 
                        console.log(res.data);
                        if(res.data.state){
                            that.$message.success(`修改第 ${that.idx + 1} 行成功`);
                            that.$set(that.tableData, that.idx, that.form);
                        }
                        else{
                            that.$message.error(`修改第 ${that.idx + 1} 行失败`);
                        }
                    }).catch(function (error) {
                            console.log(error);
                            that.$message.error(`修改第 ${that.idx + 1} 行失败`);
                    });

                    console.log("7");

                    
                }

                
               
                }
            
        },
        //获取日志
        handlejournal(index,row){
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
        // 分页导航
        handlePageChange(val) {
            this.page.index = val;
            if(this.select=='')
            {
                this.getData();
            }
            else
            {
                this.citygetdata();
            }
            
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 130px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.elinput{
    width: 80%;
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

.search-box {
      position: absolute;
      font-size:0px;
      
    }
</style>
