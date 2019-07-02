# 快速构建React App

使用create-react-app初始化项目，并集成了以下需求：

1. antd及antd按需加载；

## 项目实现过程

1. 使用create-react-app
```
npx create-react-app my-app
cd my-app
yarn start // or npm run start
```

2. 弹出配置

```
yarn eject
// or
npm run eject
```

> yarn eject 重新启动项目后可能会报错，需要删除node_modules目录后重新安装（yarn // or npm install）。

3. 使用antd 及antd 按需加载

```
yarn add antd
// or
npm install antd --save
```

### 按需加载

- [参考antd文档](https://ant.design/docs/react/use-with-create-react-app-cn#%E9%AB%98%E7%BA%A7%E9%85%8D%E7%BD%AE)

- yarn eject 自行配置

```
yarn add babel-plugin-import

// package.json
"babel": {
  "presets": [
    "react-app"
  ],
  "plugins": [
    [
      "import",
      {
        "libraryName": "antd",
        "libraryDirectory": "es",
        "style": "css"
      }
    ]
  ]
}
```