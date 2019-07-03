import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGINOUT
} from '@src/store/actions/ActionTypes';

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
