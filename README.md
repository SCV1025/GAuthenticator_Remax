# GAuthenticator_WeChat

一个简单的谷歌Authenticator微信小程序记录器

# 说明
本程序基于remax-one开发，由于使用了微信私有的API及组件，暂时仅支持微信，数据存储于微信小程序localStorage。

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

## 构建

```bash
# 选定要构建的平台，如 wechat，并执行构建
$ yarn build wechat
```

使用小程序开发者工具打开项目下的 `dist/[target]` 目录，上传代码即可。
