import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga';    //next용 redux saga
import AppLayout from '../components/AppLayout';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reducer from '../reducers';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas';
import { LOAD_USER_REQUEST } from '../reducers/user';
import axios from 'axios';

const NodeBird = ({ Component, store, pageProps }) => {
    return(
        <Provider store={store}>
            <Head>
                <title>NodeBird</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css" />
                <link rel="stylesheet" type="text/css" charset="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
            </Head>
            <AppLayout>
                <Component {...pageProps}/>   {/*pages 이다. */}
            </AppLayout>
        </Provider>
    );

};

NodeBird.propTypes = {
    Component: PropTypes.elementType.isRequired,
    store: PropTypes.object.isRequired,
    pageProps: PropTypes.object.isRequired
};

//App에서 context를 내려준다. 참고로 context는 next에서 내려준다.
//context안에 ctx, Component가 포함된다. 
//페이지 안에 getInitialProps가 있으면 해당 페이지 안에 있는 getInitialProps가 실행된다.
NodeBird.getInitialProps = async(context) => {
    console.log(context);
    const {ctx, Component} = context;
    let pageProps = {};
    const state = ctx.store.getState();
    const cookie = ctx.isServer ? ctx.req.headers.cookie : '';  //서버 환경일때만 들어가 있다. 
    console.log('cookie', cookie);
    if(ctx.isServer && cookie){ //서버인지 클라이언튼지 검사
        axios.defaults.headers.Cookie = cookie; //서버쪽에 쿠키를 넣어주는 방법
    }
    if(!state.user.me){
        ctx.store.dispatch({
            type: LOAD_USER_REQUEST,
        });
    }
    if (Component.getInitialProps){
        pageProps = await Component.getInitialProps(ctx);  //NodeBird의 <Component/>와 같은 친구이다.
    }
    return { pageProps };
};

const configureStore = (initialState, options) => {
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [sagaMiddleware, (store) => (next) => (action) => { // 리덕스 사가 에러 찾는 방식
        console.log(action);
        next(action);
    }];
    const enhancer = process.env.NODE_ENV === 'production' 
    ? compose(applyMiddleware(...middlewares))
    :compose(
        applyMiddleware(...middlewares), 
        !options.isServer && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'underfined' ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f,
    );
    const store = createStore(reducer, initialState, enhancer);
    store.sagaTask = sagaMiddleware.run(rootSaga);
    sagaMiddleware.run(rootSaga);
    return store;
};

export default withRedux(configureStore)(withReduxSaga(NodeBird));
