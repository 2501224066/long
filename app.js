// app.js
App({
    globalData: {
        leitingweb: null
    },
    onLaunch() {
        // 在app.js中引入，注意如果下文js文件域名访问受限就下载后，本地路径引用
        var ThinkingAnalyticsAPI = require('./utils/maidian')
        // leitingweb SDK 配置对象，由网站编辑组提供appId、serverUrl以及回调所需配置
        var config = {
            appId: 'dff27287619c4eb2aa30a4e28e1e982c', // 项目的APPID
            serverUrl: 'https://leitwztjshushu.leiting.com/sync_js', // 数据上报地址
            autoTrack: {
                appLaunch: true, // 自动采集小程序初始化，一次使用只会触发一次
                appShow: true, // 自动采集小程序启动，或从后台进入前台
                appHide: true, // 自动采集小程序从前台进入后台，并记录本次访问（启动至调入后台）的时间
                pageShow: true, // 自动采集小程序页面显示或切入前台，记录页面路径以及前向路径
                pageShare: true // 自动采集小程序进行转发分享，记录转发时的页面
            }
        }
        this.globalData.leitingweb = new ThinkingAnalyticsAPI(config) // 创建 leitingweb 实例
        this.globalData.leitingweb.identify() // 设置访客ID
        this.globalData.leitingweb.init() // 初始化
    },
})