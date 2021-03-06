import { all, fork, takeEvery, put, call } from 'redux-saga/effects';
import { LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE, SIGN_UP_REQUEST, SIGN_UP_FAILURE, SIGN_UP_SUCCESS, LOG_OUT_REQUEST, LOG_OUT_FAILURE, LOG_OUT_SUCCESS, LOAD_USER_SUCCESS, LOAD_USER_FAILURE, LOAD_USER_REQUEST, FOLLOW_USER_REQUEST, FOLLOW_USER_FAILURE, FOLLOW_USER_SUCCESS, UNFOLLOW_USER_REQUEST, UNFOLLOW_USER_FAILURE, UNFOLLOW_USER_SUCCESS, LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWERS_SUCCESS, LOAD_FOLLOWERS_FAILURE, LOAD_FOLLOWINGS_REQUEST, LOAD_FOLLOWINGS_SUCCESS, REMOVE_FOLLOWER_REQUEST, REMOVE_FOLLOWER_FAILURE, REMOVE_FOLLOWER_SUCCESS, LOAD_FOLLOWINGS_FAILURE, EDIT_NICKNAME_SUCCESS, EDIT_NICKNAME_FAILURE, EDIT_NICKNAME_REQUEST} from '../reducers/user';
import axios from 'axios';

//call은 함수 동기적 호출 => 순서를 무조건! 지켜야할때
//fork는 함수 비동기적 호출 => 얘 실행해두고 다음꺼 실행해도 될 때 
//put은 액션 dispatch
//takeEvery는 while(true)와 유사하다!
//takeLatest는 동시에 실행하면 맨마지막만 받겠다... 뭐 그렇대 ex)로그인 버튼 막 클릭할때 마지막에 누른것만 유효하게 인정하고싶을때 
/*
여러번 클릭하는게 실수다! =>takeLatest 사용
여러번 클릭해야한다! => takeEvery 사용
*/

axios.defaults.baseURL = 'http://localhost:3065/api';

function logInAPI(loginData) {
    //서버에 요청을 보내는 부분
    return axios.post('/user/login', loginData, {
        withCredentials: true,  //쿠키생성
    });
}

function* logIn(action) {
    try{
        const result = yield call(logInAPI, action.data);
        yield put({
            type: LOG_IN_SUCCESS,
            data: result.data
        });
    }catch (e) {
        console.error(e);
        yield put({
            type: LOG_IN_FAILURE
        });
    }
}

function* watchLogIn() {
    yield takeEvery(LOG_IN_REQUEST, logIn) 
}

function signUpAPI(signUpData) {
    //서버에 요청을 보내는 부분
    return axios.post('/user/', signUpData)
}

function* signUp(action) {
    try{
        // yield call(signUpAPI);
        yield call(signUpAPI, action.data); //call 함수는 첫번째는 함수 두번째는 인자
        yield put({
            type: SIGN_UP_SUCCESS
        });
    }catch (e) {
        console.error(e);
        yield put({
            type: SIGN_UP_FAILURE,
            error: e
        });
    }
}

function* watchSignUp() {
    yield takeEvery(SIGN_UP_REQUEST, signUp);
}

function logOutAPI() {
    //서버에 요청을 보내는 부분
    return axios.post('/user/logout', {}, {
        withCredentials: true,
    })
}

function* logOut() {
    try{
        // yield call(logOutAPI);
        yield call(logOutAPI); //call 함수는 첫번째는 함수 두번째는 인자
        yield put({
            type: LOG_OUT_SUCCESS
        });
    }catch (e) {
        console.error(e);
        yield put({
            type: LOG_OUT_FAILURE,
            error: e
        });
    }
}

function* watchLogOut() {
    yield takeEvery(LOG_OUT_REQUEST, logOut);
}

function loadUserAPI(userId) {
    //서버에 요청을 보내는 부분
    //userId가 있으면 남, 없으면 자신
    return axios.get(userId ? `/user/${userId}` : '/user/', {
        withCredentials: true,  //클라이언트에서 요청 보낼 때는 브라우저가 쿠키를 같이 동봉해준다. 
    }); //서버사이드렌더링일 때는, 브라우저가 없다. 
}
function* loadUser(action) {
    try{
        const result = yield call(loadUserAPI, action.data); //call 함수는 첫번째는 함수 두번째는 인자
        yield put({
            type: LOAD_USER_SUCCESS,
            data: result.data,
            me: !action.data,
        });
    }catch (e) {
        console.error(e);
        yield put({
            type: LOAD_USER_FAILURE,
            error: e
        });
    }
}
function* watchLoadUser() {
    yield takeEvery(LOAD_USER_REQUEST, loadUser);
}

function followAPI(userId) {
    //서버에 요청을 보내는 부분
    //userId가 있으면 남, 없으면 자신
    return axios.post(`/user/${userId}/follow`, {}, {
        withCredentials: true,
    });
}
function* follow(action) {
    try{
        const result = yield call(followAPI, action.data); //call 함수는 첫번째는 함수 두번째는 인자
        yield put({
            type: FOLLOW_USER_SUCCESS,
            data: result.data,
        });
    }catch (e) {
        console.error(e);
        yield put({
            type: FOLLOW_USER_FAILURE,
            error: e
        });
    }
}
function* watchFollow() {
    yield takeEvery(FOLLOW_USER_REQUEST, follow);
}

function unfollowAPI(userId) {
    //서버에 요청을 보내는 부분
    //userId가 있으면 남, 없으면 자신
    return axios.delete(`/user/${userId}/follow`,{
        withCredentials: true,
    });
}
function* unfollow(action) {
    try{
        const result = yield call(unfollowAPI, action.data); //call 함수는 첫번째는 함수 두번째는 인자
        yield put({
            type: UNFOLLOW_USER_SUCCESS,
            data: result.data,
        });
    }catch (e) {
        console.error(e);
        yield put({
            type: UNFOLLOW_USER_FAILURE,
            error: e
        });
    }
}
function* watchUnfollow() {
    yield takeEvery(UNFOLLOW_USER_REQUEST, unfollow);
}

function loadFollowersAPI(userId, offset = 0, limit = 3) {
    //서버에 요청을 보내는 부분
    //userId가 있으면 남, 없으면 자신
    //주소체계를 안바꾸고 서버로 추가적인 데이터를 보내고 싶을때 쿼리스트링을 사용하자
    // 주소에서 ? 이후로 쿼리스트링! key=value로 보낸다. 여러개 보낼땐 &로 붙여준다
    return axios.get(`/user/${userId || 0}/followers?offset=${offset}&limit=${limit}`,{
        withCredentials: true,
    });
}
function* loadFollowers(action) {
    try{
        const result = yield call(loadFollowersAPI, action.data, action.offset); //call 함수는 첫번째는 함수 두번째는 인자
        yield put({
            type: LOAD_FOLLOWERS_SUCCESS,
            data: result.data,
        });
    }catch (e) {
        console.error(e);
        yield put({
            type: LOAD_FOLLOWERS_FAILURE,
            error: e
        });
    }
}
function* watchLoadFollowers() {
    yield takeEvery(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

function loadFollowingsAPI(userId, offset = 0, limit = 3) {
    //서버에 요청을 보내는 부분
    //userId가 있으면 남, 없으면 자신
    return axios.get(`/user/${userId || 0}/followingsoffset=${offset}&limit=${limit}`,{
        withCredentials: true,
    });
}
function* loadFollowings(action) {
    try{
        const result = yield call(loadFollowingsAPI, action.data, action.offset); //call 함수는 첫번째는 함수 두번째는 인자
        yield put({
            type: LOAD_FOLLOWINGS_SUCCESS,
            data: result.data,
        });
    }catch (e) {
        console.error(e);
        yield put({
            type: LOAD_FOLLOWINGS_FAILURE,
            error: e
        });
    }
}
function* watchLoadFollowings() {
    yield takeEvery(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

function removeFollowerAPI(userId) {
    //서버에 요청을 보내는 부분
    return axios.delete(`/user/${userId}/follower`,{
        withCredentials: true,
    });
}
function* removeFollower(action) {
    try{
        const result = yield call(removeFollowerAPI, action.data); //call 함수는 첫번째는 함수 두번째는 인자
        yield put({
            type: REMOVE_FOLLOWER_SUCCESS,
            data: result.data,
        });
    }catch (e) {
        console.error(e);
        yield put({
            type: REMOVE_FOLLOWER_FAILURE,
            error: e
        });
    }
}
function* watchRemoveFollower() {
    yield takeEvery(REMOVE_FOLLOWER_REQUEST, removeFollower);
}

function editNicknameAPI(nickname) {
    //서버에 요청을 보내는 부분
    return axios.patch(`/user/nickname`, {nickname},{
        withCredentials: true,
    });
}
function* editNickname(action) {
    try{
        const result = yield call(editNicknameAPI, action.data); //call 함수는 첫번째는 함수 두번째는 인자
        yield put({
            type: EDIT_NICKNAME_SUCCESS,
            data: result.data,
        });
    }catch (e) {
        console.error(e);
        yield put({
            type: EDIT_NICKNAME_FAILURE,
            error: e
        });
    }
}
function* watchEditNickname() {
    yield takeEvery(EDIT_NICKNAME_REQUEST, editNickname);
}
export default function* userSaga() {
    yield all([
        fork(watchLogIn),
        fork(watchLogOut),
        fork(watchLoadUser),
        fork(watchSignUp),
        fork(watchFollow),
        fork(watchUnfollow),
        fork(watchLoadFollowers),
        fork(watchLoadFollowings),
        fork(watchRemoveFollower),
        fork(watchEditNickname),
    ]);
}