import { all, fork, takeLatest, call, put, take } from 'redux-saga/effects';
import { LOG_IN, LOG_IN_SUCCESS, LOG_IN_FAILURE} from '../reducers/user';

//call은 함수 동기적 호출
//fork는 함수 비동기적 호출
//put은 액션 dispatch

const HELLO_SAGA = 'HELLO_SAGA';

function loginAPI() {
    //서버에 요청을 보내는 부분
}

function* login() {
    try{
        yield call(loginAPI);
        yield put({
            type: LOG_IN_SUCCESS
        })
    }catch (e) {
        console.error(e);
        yield put({
            type: LOG_IN_FAILURE
        })
    }
}

function* watchLogin() {
    while(true){
        yield take(LOG_IN);
        yield delay(2000);
        yield put({
            type: LOG_IN_SUCCESS,
        });
    }   
}

function* watchSignUp() {

}

export default function* userSaga() {
    yield all([
        watchLogin(),
        watchSignUp(),
    ]);
}