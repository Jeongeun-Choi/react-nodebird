//메인화면
import React from 'react';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { useDispatch, useSelector } from 'react-redux';

const Home = () => {
    const { isLoggedIn, user } = useSelector(state => state.user);
    const { mainPosts } = useSelector(state => state.post);
    // useEffect(() => {
    //     dispatch(loginAction);
    //     dispatch(logoutAction);
    //     dispatch(loginAction);
    // }, []);

    return(
    <div>
        {isLoggedIn && <PostForm />}
        {mainPosts.map((c) => {
            return (
                <PostCard key={c} post={c}/>
            );
        })}
    </div>
    );
};

export default Home;