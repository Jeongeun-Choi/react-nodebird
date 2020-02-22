import { all, fork, takeLatest, delay, put, call } from 'redux-saga/effects';
import { ADD_POST_FAILURE, ADD_POST_REQUEST, ADD_POST_SUCCESS, ADD_COMMENT_FAILURE, ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, LOAD_MAIN_POSTS_SUCCESS, LOAD_MAIN_POSTS_FAILURE, LOAD_MAIN_POSTS_REQUEST } from '../reducers/post';
import axios from 'axios';

function addPostAPI(postData){
    return axios.post('/post', postData, {
        withCredentials: true,
    });
}

function* addPost(action){
    try{
        const result = yield call(addPostAPI, action.data)
        yield put({
            type: ADD_POST_SUCCESS,
            data: result.data,
        });
    } catch (e) {
        yield put({
            type: ADD_POST_FAILURE,
            error: e,
        });
    }
}

function* watchAddPost() {
    yield takeLatest(ADD_POST_REQUEST, addPost);
}

function addCommentAPI(){
    
}

function* addComment(action){
    try{
        yield delay(2000);
        yield put({
            type: ADD_COMMENT_SUCCESS,
            data: {
                postId: action.data.postId,
            },
        });
    } catch (e) {
        yield put({
            type: ADD_COMMENT_FAILURE,
            error: e,
        });
    }
}

function* watchAddComment() {
    yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

function loadMainPostsAPI(){
    return axios.get('/posts');
}

function* loadMainPosts(action){
    try{
        const result = yield call(loadMainPosts);
        yield put({
            type: LOAD_MAIN_POSTS_SUCCESS,
            data: result.data,
        });
    } catch (e) {
        yield put({
            type: LOAD_MAIN_POSTS_FAILURE,
            error: e,
        });
    }
}

function* watchLoadMainPosts() {
    yield takeLatest(LOAD_MAIN_POSTS_REQUEST, addComment);
}

export default function* postSaga() {
    yield all ([
        fork(watchAddPost),
        fork(watchLoadMainPosts),
        fork(watchAddComment),
    ])
}