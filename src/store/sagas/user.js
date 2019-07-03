import { call, put, takeLatest } from 'redux-saga/effects';
import http from '@src/utils/http'
import {
    FETCH_LOGIN,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    FETCH_LOGINOUT,
    LOGINOUT,
} from '@src/store/actions/ActionTypes';

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
