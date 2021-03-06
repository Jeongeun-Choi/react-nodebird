import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../components/PostCard';
import { Avatar, Card } from 'antd';
import { LOAD_USER_REQUEST } from '../reducers/user';

const User = () => {
    const {mainPosts} = useSelector(state => state.post);
    const {userInfo} = useSelector(state => state.user);

    return (
        <div>
            {userInfo
            ?  (<Card
                actions={[
                    <>
                    <div key="twit">짹짹<br/>{userInfo.Posts}</div>
                    <div key="following">팔로잉<br/>{userInfo.Followings}</div>
                    <div key="follower">팔로워<br/>{userInfo.Followers}</div>
                    </>
                    ]}
            >
                <Card.Meta 
                    avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
                    title={userInfo.nickname}
                />
            </Card>)
            : null
            }
            {mainPosts.map(c => (
                <PostCard key={+c.createdAt} post={c} />
            ))}
        </div>
    );
};

User.propTypes = {
    id: PropTypes.number.isRequired,
};

//제일 먼저 실행됨. 가장 최초로 작업할 수 있다. 
//프론트에서도 실행, 서버에서도 실행
//서버 쪽에선 처음으로 이 페이지를 불러올때
//프론트에선 next router로 페이지를 넘나들때
//필요한 데이터를 서버에서 미리 불러와서 프론트에 렌더링 가능
User.getInitialProps = async(context) =>{
    const id = parseInt(context.query.id, 10);
    console.log('User getInitialProps', context.query.id);
    context.store.dispatch({
        type: LOAD_USER_REQUEST,
        data: id,
    });
    context.store.dispatch({
        type: LOAD_USER_POSTS_REQUEST,
        data: id,
    });
    return {id};
};

export default User;