import produce from 'immer';

export const initialState = {
    isLoggedIn: false,
    user: null,
};

const dummyUser = {
    nickname: '정은',
    Post: [],
    Followings: [],
    Followers: [],
};

export const LOG_IN = 'LOG_IN';    //액션의 이름
export const LOG_OUT = 'LOG_OUT';

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
            default: {
                break;
            }
        }
    })
};
