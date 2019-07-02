# 快速构建React App

使用create-react-app初始化项目，并集成了以下需求：

1. antd及antd按需加载；
2. less,less-loader;
3. webpack 配置目录别名;
4. 状态管理redux、react-redux、redux-saga,axios请求（包含js-cookie）;
5. 路由react-router-dom;

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

### 状态管理redux、react-redux、redux-saga,axios请求（包含js-cookie）

```
yarn add redux react-redux redux-saga axios js-cookie
```
> src/index.js

```
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga'
import rootReducer from './reducers'
import saga from './sagas'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware()
const store = createStore(
    rootReducer,
    composeEnhancers(
        applyMiddleware(sagaMiddleware)
    )
);

sagaMiddleware.run(saga)

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
```

> actions

```
// actions/index.js
import * as userActions from './user'

export default {
    ...userActions,
}

// actions/user.js
import {
    FETCH_LOGIN,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    FETCH_LOGINOUT,
    LOGINOUT,
} from './ActionTypes';

export const fetch_login = (payload) => {
    return {
        type: FETCH_LOGIN,
        payload
    }
}

export const login_success = (data) => {
    return {
        type: LOGIN_SUCCESS,
        data
    }
}

export const login_fail = (message) => {
    return {
        type: LOGIN_FAIL,
        message
    }
}

export const fetch_loginout = (payload) => {
    return {
        type: FETCH_LOGINOUT,
        payload
    }
}

export const loginout = (message) => {
    return {
        type: LOGINOUT,
        message
    }
}
```

> reducers

```
// reducers/index.js
import { combineReducers } from 'redux'
import user from './user'

export default combineReducers({
  user,
})

// reducers/user.js
import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGINOUT
} from '@src/actions/ActionTypes';

export default (state = { isLogin: false, userInfo: {} }, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                isLogin: true,
                userInfo: action.data,
            };
        case LOGIN_FAIL:
            return {
                isLogin: false,
                userInfo: {},
            };
        case LOGINOUT:
            return {
                isLogin: false,
                userInfo: {},
            }
        default:
            return state;
    }
};
```

> sagas

```
// sagas/index.js
import { all } from 'redux-saga/effects';
import { watchUserAsync } from './user';

export default function* rootSaga() {
   yield all([
      watchUserAsync(),
   ])
}

// sagas/user.js
import { call, put, takeLatest } from 'redux-saga/effects';
import http from '@src/utils/http'
import {
    FETCH_LOGIN,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    FETCH_LOGINOUT,
    LOGINOUT,
} from '@src/actions/ActionTypes';

// 登录
function* fetchLogin({ actionParams = {} }) {
    const { requestConfig = {}, resolve, reject } = actionParams;
    try {
        const res = yield call(http, requestConfig);
        if (res.data && res.data.message === "OK") {
            let result = res.data.result || {};
            yield put({ type: LOGIN_SUCCESS, data: result });
            resolve(res)
        } else {
            yield put({
                type: LOGIN_FAIL,
                message: (res.data && res.data.message) || '登录失败'
            });
            reject(res.data)
        }
    } catch (e) {
        yield put({ type: LOGIN_FAIL, message: e.message });
        reject(e)
    }
}

// 退出
function* fetchLoginOut({ actionParams = {} }) {
    const { requestConfig = {}, resolve, reject } = actionParams;
    try {
        const res = yield call(http, requestConfig);
        yield put({ type: LOGINOUT });
        resolve(res)
    } catch (e) {
        yield put({ type: LOGINOUT });
        reject(e)
    }
}

export function* watchUserAsync() {
    yield takeLatest(FETCH_LOGIN, fetchLogin)
    yield takeLatest(FETCH_LOGINOUT, fetchLoginOut)
}
```

> axios

```
import axios from "axios";
import { BASE_URL, HTTP_TIMEOUT } from "@src/config";
import Cookies from 'js-cookie';

axios.defaults.baseURL = BASE_URL;
axios.defaults.timeout = HTTP_TIMEOUT;
axios.defaults.headers = { 'X-Requested-With': 'XMLHttpRequest' };

// 添加请求拦截器
axios.interceptors.request.use(
    config => {
        if (config.url === "/login") {
            return config;
        }
        if (Cookies.get('token')) {
            // 为除了登陆的请求在header里添加token
            config.headers.Authorization = Cookies.get('token')
            return config;
        } else {
            return Promise.reject(new Error("token失效"));
        }
    },
    error => {
        return Promise.reject(error);
    }
);

// 添加响应拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);

export default (config = {}) => {
    if (config.method === "post") {
        config = Object.assign({
            headers: {
                'Content-Type': 'application/json'
            }
        }, config)
    }
    return new Promise((resolve, reject) => {
        axios({
            ...config,
        }).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error)
        })
    })
}
```

### react-router-dom

```
yarn add react-router-dom

// src/index.js
import { BrowserRouter as Router } from "react-router-dom";
ReactDOM.render(
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>, document.getElementById('root'));

// src/App.js
import { Route } from "react-router-dom";
...
<div className="App">
  <Route exact path="/" component={Home}/>
  <Route exact path="/about" component={About}/>
</div>
```

### 按需加载 react-loadable

使用这个插件，只有当路由匹配的时候，组件才会被import进来，达到了code splitting的效果，即按需加载，代码分块，而不是一开始就将全部组件加载。

```
yarn add react-loadable

import React from 'react'
import Loadable from 'react-loadable';
import { Spin } from 'antd';

const Loading = ({ isLoading, error }) => {
    if (isLoading) {
        return <div
            style={{ position: 'fixed', left: 0, top: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Spin spinning={isLoading} />
        </div>
    }
    else if (error) { // Handle the error state
        return <div className="loading">页面加载失败,请刷新重试</div>;
    }
    else {
        return null;
    }
}

export default function MyLoadable(opts) {
    return Loadable(Object.assign({
        loading: Loading,
        delay: 300
    }, opts));
}

// 使用方法
<Route exact path="/" component={MyLoadable({ loader: () => import('@src/pages/Home') })} />
<Route exact path="/about" component={MyLoadable({ loader: () => import('@src/pages/About') })} />
```