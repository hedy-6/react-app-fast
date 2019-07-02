//  懒加载,显示loading
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
