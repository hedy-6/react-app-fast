import {
    FETCH_LOGIN,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    FETCH_LOGINOUT,
    LOGINOUT,
} from './ActionTypes';
/**
 * 登录，退出
 */
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