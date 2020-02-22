import produce from 'immer';

export const initialState = {
    mainPosts: [{
        id: 1,
        User: {
            id: 1,
            nickname: '둉은이',
        },
        content: '첫 번째 게시글',
        img: '',
        Comments: [],
    }], //화면에 보일 포스트들
    imagePaths: [], //미리보기 이미지 경로
    addPostErrorReason: '',    //포스트 업로드 실패 사유
    isAddingPost: false,          //포스트 업로드 중
    postAdded: false,               //포스트 업로드 성공
    isAddingComment: false,
    addCommentErrorReason: '',
    commentAdded: false,
};

const dummyPost = {
    id: 2,
    User: {
        id: 1,
        nickname: '정은',
    },
    content: '나는 더미입니다.',
    Comments: [],
};

const dummyComment = {
    id: 1,
    User: {
        id: 1,
        nickname: '정은',
    },
    createdAt: new Date(),
    content: '더미 댓글입니다.',
}

export const LOAD_MAIN_POSTS_REQUEST = 'LOAD_MAIN_POSTS_REQUEST';
export const LOAD_MAIN_POSTS_SUCCESS = 'LOAD_MAIN_POSTS_SUCCESS';
export const LOAD_MAIN_POSTS_FAILURE = 'LOAD_MAIN_POSTS_FAILURE';

export const LOAD_HASHTAG_POSTS_REQUEST = 'LOAD_HASHTAG_POSTS_REQUEST';
export const LOAD_HASHTAG_POSTS_SUCCESS = 'LOAD_HASHTAG_POSTS_SUCCESS';
export const LOAD_HASHTAG_POSTS_FAILURE = 'LOAD_HASHTAG_POSTS_FAILURE';

export const LOAD_USER_POSTS_REQUEST = 'LOAD_USER_POSTS_REQUEST';
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAILURE = 'LOAD_USER_POSTS_FAILURE';

export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE';

export const REMOVE_IMAGE = 'REMOVE_IMAGE';

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';

export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const LOAD_COMMENT_REQUEST = 'LOAD_COMMENT_REQUEST';
export const LOAD_COMMENT_SUCCESS = 'LOAD_COMMENT_SUCCESS';
export const LOAD_COMMENT_FAILURE = 'LOAD_COMMENT_FAILURE';

export const RETWEET_REQUEST = 'RETWEET_REQUEST';
export const RETWEET_SUCCESS = 'RETWEET_SUCCESS';
export const RETWEET_FAILURE = 'RETWEET_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

const reducer = (state = initialState, action) => {
    return produce(state, draft => {
        switch(action.type){
            case ADD_POST_REQUEST: {
                draft.isAddingPost = true;
                draft.addPostErrorReason = '';
                draft.postAdded = false;
                break;
            }
            case ADD_POST_SUCCESS: {
                draft.isAddingPost = false;
                draft.mainPosts.unshift(action.data);
                draft.postAdded = true;
                break;
            }
            case ADD_POST_FAILURE: {
                draft.isAddingComment = false;
                draft.addCommentErrorReason = action.error;
                break;
            }
            case ADD_COMMENT_REQUEST: {
                draft.isAddingComment = true;
                draft.addCommentErrorReason = '';
                draft.commentAdded = false;
                break;
            }
            case ADD_COMMENT_SUCCESS: {
                const postIndex = draft.mainPosts.findIndex(v => v.id === action.data.postId);
                draft.mainPosts[postIndex].Comments.push(dummyComment);
                draft.isAddingComment = false;
                draft.commentAdded = true;
                break;
            }
            case ADD_COMMENT_FAILURE: {
                draft.isAddingComment = false;
                draft.addCommentErrorReason = action.error;
                break;
            }
            case LOAD_MAIN_POSTS_REQUEST: {
                draft.mainPosts = [];
                break;
            }
            case LOAD_MAIN_POSTS_SUCCESS: {
                draft.mainPosts = action.data;
                break;
            }
            case LOAD_MAIN_POSTS_FAILURE: {
                break;
            }
            default:
                break;
        }
    }) 
}

export default reducer;