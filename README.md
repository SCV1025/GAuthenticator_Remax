# GAuthenticator_WeChat

一个简单的谷歌Authenticator微信小程序记录器

## 说明

![image](https://github.com/wlfcss/GAuthenticator_WeChat/blob/master/JIETU.jpg)

本程序基于remax-one开发，使用react-hooks方式实现，由于使用了微信私有的API及组件，暂时仅支持微信，数据存储于微信小程序localStorage。

## 开发进度及计划说明
- [x] 扫码添加
- [x] 输入秘钥链接添加  
- [x] 倒计时
- [x] 小程序本地localstorage存储
- [x] 详情方式添加动态密码 //2021.1.11
- [ ] 删除动态密码
- [ ] 切换动态密码顺序
- [ ] 个人中心（主要是没想好这玩意拿来干啥）
- [ ] 云端备份存储 OR 云端双向同步
- [ ] 支持 头条、阿里等小程序
- [ ] 支持web端

## 使用第三方依赖及感谢
- 核心框架：remax.js
- UI组件：annar-UI
- HOTP/TOTP 解析依赖：[otpauth](https://github.com/hectorm/otpauth)


## 开发

安装依赖

```bash
yarn 
```

调试项目

```bash
yarn dev wechat
```

使用小程序开发者工具打开项目下的 `dist/[target]` 目录。
