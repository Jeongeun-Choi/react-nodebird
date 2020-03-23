import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import { LOAD_HASHTAG_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../components/PostCard';

const Hashtag = ({tag}) => {
    console.log(tag)
    const dispatch = useDispatch();
    const {mainPosts} = useSelector(state => state.post);

    useEffect(() => {
        dispatch({
            type: LOAD_HASHTAG_POSTS_REQUEST,
            data: tag,
        });
    }, []);

    return (
        <div>
            {mainPosts.map(c => (
                <PostCard key={+c.createdAt} post={c} />
            ))}
        </div>
    );
};

Hashtag.propTypes = {
    tag: PropTypes.string.isRequired,
}
//제일 먼저 실행됨. 가장 최초로 작업할 수 있다. 
//프론트에서도 실행, 백에서도 실행
//필요한 데이터를 서버에서 미리 불러와서 프론트에 렌더링 가능
Hashtag.getInitialProps = async(context) =>{
    console.log('hashtag getInitialProps', context.query.tag);
    return {tag: context.query.tag};
};

export default Hashtag;