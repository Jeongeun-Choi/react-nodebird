import { all, delay, fork, takeEvery, put } from 'redux-saga/effects';
import { LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE, SIGN_UP_REQUEST, SIGN_UP_FAILURE, SIGN_UP_SUCCESS} from '../reducers/user';
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

function loginAPI() {
    //서버에 요청을 보내는 부분
    return axios.post('/login');
}

function* login() {
    try{
        //yield call(loginAPI);
        yield delay(2000);
        yield put({
            type: LOG_IN_SUCCESS
        });
    }catch (e) {
        console.error(e);
        yield put({
            type: LOG_IN_FAILURE
        });
    }
}

function* watchLogin() {
    yield takeEvery(LOG_IN_REQUEST, login) 
}

function signUpAPI(signUPData) {
    //서버에 요청을 보내는 부분
    return axios.post('http://localhost:3065/api/user/', signUpData)
}

function* signUp(action) {
    try{
        // yield call(signUpAPI);
        yield call(signUpAPI, action.data); //call 함수는 첫번째는 함수 두번째는 인자
        throw new Error('에러에ㅓ레어렝');
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

export default function* userSaga() {
    yield all([
        fork(watchLogin),
        fork(watchSignUp),
    ]);
}