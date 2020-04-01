//메인화면
import React, { useEffect } from 'react';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import {LOAD_MAIN_POSTS_REQUEST} from '../reducers/post';
import { useDispatch, useSelector } from 'react-redux';

const Home = () => {
    const { me} = useSelector(state => state.user);
    const { mainPosts } = useSelector(state => state.post);
    const dispatch = useDispatch();

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