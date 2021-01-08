const pages = ['pages/index/index','pages/home/index'];

module.exports.ali = {
    pages,
    window: {
        defaultTitle: '这是阿里小程序标题',
        titleBarColor: '#282c34',
    },
};

module.exports.wechat = {
    pages,
    window: {
        navigationBarTitleText: '动态密码记录本',
        navigationBarBackgroundColor: '#FFFFFF',
        navigationBarTextStyle: 'black',
        enablePullDownRefresh:true,
        onReachBottomDistance:400,
    },
    tabBar: {
        color: "#C1C1C1",
        selectedColor: "#333333",
        borderStyle: "black",
        backgroundColor: "#FFF",
        list: [
            {
                text: "动态密码",
                pagePath: 'pages/index/index',
                iconPath:'assets/icon_index.png',
                selectedIconPath:'assets/icon_index_active.png'
            },
            {
                text: "个人中心",
                pagePath: 'pages/home/index',
                iconPath:'assets/icon_home.png',
                selectedIconPath:'assets/icon_home_active.png'
            },
        ]
    },
};

module.exports.toutiao = {
    pages,
    window: {
        navigationBarTitleText: '头条小程序标题',
        navigationBarBackgroundColor: '#FB6A33',
    },
};

module.exports.web = {
    pages,
    title: 'Remax Web Template',
};
