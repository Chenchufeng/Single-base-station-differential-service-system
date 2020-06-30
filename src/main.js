import Vue from 'vue';
import App from './App.vue';
import VueAMap from 'vue-amap';
import router from './router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import * as signalR from '@aspnet/signalr';
import axios from 'axios';

//axios.defaults.crossDomain = true;
//axios.defaults.withCredentials = true;
//Vue.prototype.$axios = axios;
/*
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios,axios);
this.axios.get*/

Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
const i18n = new VueI18n({
    locale: 'zh',
    messages
});
localStorage.setItem('urls', "http://localhost:8080/");

//Vue.use(VueAMap);
// setTimeout(() => {
//     localStorage.removeItem('_AMap_raster');
//     Vue.use(VueAMap);
// }, 0);
VueAMap.initAMapApiLoader({
    key: '054de1cffc1dee7bf99d92bb0357d1af',
    plugin: ['Amap.Geolocation','Amap.MarkerClusterer','AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
    // 默认高德 sdk 版本为 1.4.4
    //v: '1.4.4',

});

//Vue.use(signalR);



//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
    const role = localStorage.getItem('ms_usertype');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.BaseTable) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        //to.meta.title='设备查看';
        //role === 'admin' ? next() : next('/403');
    }else if(to.path === '/dashboard'){
        if(localStorage.getItem('ms_usertype')=="ADMIN"||localStorage.getItem('ms_usertype')=="TECHNOLOGY")
        {
            next('/dashboardadmin');
        }
        else
        {
            next();
        }
    }
     else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
});

new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app');
