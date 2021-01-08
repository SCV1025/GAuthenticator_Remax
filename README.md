# Remax One

使用 Remax 开发跨平台小程序。

## Getting Start

安装依赖

```bash
yarn //由于依赖了node-sass,建议使用eyn工具进行初始化
```

调试项目

```bash
# 选定要进行开发的平台，如 wechat，并调试
yarn dev wechat
```

使用小程序开发者工具打开项目下的 `dist/[target]` 目录。

## 构建

```bash
# 选定要构建的平台，如 wechat，并执行构建
$ yarn build wechat
```

使用小程序开发者工具打开项目下的 `dist/[target]` 目录，上传代码即可。
