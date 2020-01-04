import produce from 'immer';

export const initialState = {
    mainPosts: [{
        User: {
            id: 1,
            nickname: '둉은이',
        },
        content: '첫 번째 게시글',
        img: '',
    }],
    imagePaths: [],
};

const ADD_POST = 'ADD_POST';
const ADD_DUMMY = 'ADD_DUMMY';

const addPost = {
    type: ADD_POST,
};

const addDummy = {
    type: ADD_DUMMY,
    data: {
        content: 'Hello',
        UserId: 1,
        User: {
            nickname: 'jeys',
        },
    },
};

const reducer = (state = initialState, action) => {
    return produce(state, draft => {
        switch(action.type){
            case ADD_POST: {
                break;
            }
            case ADD_DUMMY: {
                draft.mainPosts.unshift(action.data);
                break;
            }
            default:
                break;
        }
    }) 
}

export default reducer;