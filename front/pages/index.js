//메인화면
import React, { useEffect, useCallback } from 'react';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import {LOAD_MAIN_POSTS_REQUEST} from '../reducers/post';
import { useDispatch, useSelector } from 'react-redux';

const Home = () => {
    const { me} = useSelector(state => state.user);
    const { mainPosts } = useSelector(state => state.post);
    const dispatch = useDispatch();

    const onScroll = useCallback(() => {
        //스크롤 내린 거리, 화면 높이, 전체 화면 길이
        console.log(window.scrollY, document.documentElement.clientHeight, document.documentElement.scrollHeight);
        if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300){
            dispatch({
                type: LOAD_MAIN_POSTS_REQUEST,
                lastId: mainPosts[mainPosts.length - 1].id,
            });
        }
    },[])
    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll); //이벤트 단건 마지막에 정리해야줘야한다.
        }
    }, [mainPosts.length]);

    return(
    <div>
        {me && <PostForm />}
        {mainPosts.map((c) => {
            return (
                <PostCard key={c} post={c}/>
            );
        })}
    </div>
    );
};

//console.log(Object.keys(context)) 해서 가져온 키들 중
//store는 redux store 이 안에는 dispatch, getstate=>redux의 state를 가져올 수 있다. 
Home.getInitialProps = async (context) => {
    console.log(Object.keys(context));
    context.store.dispatch({
        type: LOAD_MAIN_POSTS_REQUEST,
    });
};

export default Home;