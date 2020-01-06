import produce from 'immer';

export const initialState = {
    isLoggedIn: false,
    user: null,
    signUpData: {},
};

const dummyUser = {
    nickname: '정은',
    Post: [],
    Followings: [],
    Followers: [],
};

export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP = 'SIGN_UP';
export const LOG_IN = 'LOG_IN';    //액션의 이름
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';
export const LOG_OUT = 'LOG_OUT';

export const signUpSuccess = {
    type: SIGN_UP_SUCCESS,
}
export const signUpAction = (data) => {
    return {
        type: SIGN_UP,
        data: data,
    }
}
export const loginAction = ({id, password}) => {
    return {
        type: LOG_IN,
        data:{
            nickname: 'jeys',
        }
    }
}
 
export const logoutAction = {
    type: LOG_OUT,
};

export default (state = initialState, action) => {
    return produce(state, draft => {
        switch(action.type){
            case LOG_IN: { 
                draft.isLoggedIn = true;
                draft.user = dummyUser;
                break;
            }
            case LOG_OUT: {
                draft.isLoggedIn = false;
                draft.user = null;
                break;
            }
            case SIGN_UP: {
                draft.signUpData = action.data;
                break;
            }
            default: {
                break;
            }
        }
    })
};
