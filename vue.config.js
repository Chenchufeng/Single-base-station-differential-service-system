module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    // devServer: {
    //     proxy: {
    //         '/api':{
    //             target:'http://10.10.200.78:5000',
    //             changeOrigin:true,
    //             pathRewrite:{
    //                 //'http://10.10.200.78:5000/api':'/api'
    //                 'http://10.10.200.78:5000': '' 
    //             }
    //         }
    //     }
    // }
    devServer: {
        proxy: {
            '/api':{
                target:'http://127.0.0.1:5000',
                changeOrigin:true,
                pathRewrite:{
                    '^/api': '/api' 
                }
            }
        }
    }
}