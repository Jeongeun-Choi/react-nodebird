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

    useEffect(()=>{
        dispatch({
            type: LOAD_MAIN_POSTS_REQUEST,
        });
    }, []);
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

export default Home;