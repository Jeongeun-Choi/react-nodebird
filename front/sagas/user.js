import { all, fork, takeEvery, put, call } from 'redux-saga/effects';
import { LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE, SIGN_UP_REQUEST, SIGN_UP_FAILURE, SIGN_UP_SUCCESS, LOG_OUT_REQUEST, LOG_OUT_FAILURE, LOG_OUT_SUCCESS, LOAD_USER_SUCCESS, LOAD_USER_FAILURE, LOAD_USER_REQUEST} from '../reducers/user';
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
        withCredentials: true,
    });
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

export default function* userSaga() {
    yield all([
        fork(watchLogIn),
        fork(watchLogOut),
        fork(watchLoadUser),
        fork(watchSignUp),
    ]);
}