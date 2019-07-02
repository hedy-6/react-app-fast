# 快速构建React App

使用create-react-app初始化项目，并集成了以下需求：

1. antd及antd按需加载；
2. less,less-loader;
3. webpack 配置目录别名

## 项目实现过程

### 使用create-react-app
```
npx create-react-app my-app
cd my-app
yarn start // or npm run start
```

### 弹出配置

```
yarn eject
// or
npm run eject
```

> yarn eject 重新启动项目后可能会报错，需要删除node_modules目录后重新安装（yarn // or npm install）。

### 使用antd 及antd 按需加载

```
yarn add antd
// or
npm install antd --save
```

#### 按需加载

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

### less，less-loader

```
yarn add less less-loader

// webpack.config.js
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;
......
{
  test: lessRegex,
  exclude: lessModuleRegex,
  use: getStyleLoaders(
    {
      importLoaders: 2,
      sourceMap: isEnvProduction && shouldUseSourceMap,
    },
    'less-loader'
  ),
  sideEffects: true,
},
{
  test: lessModuleRegex,
  use: getStyleLoaders(
    {
      importLoaders: 2,
      sourceMap: isEnvProduction && shouldUseSourceMap,
      modules: true,
      getLocalIdent: getCSSModuleLocalIdent,
    },
    'less-loader'
  ),
},
```

### webpack 配置目录别名

```
// webpack.config.js
alias: {
    "@": path.resolve("src"),
    ......
},
```