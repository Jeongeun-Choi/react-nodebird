import React, { useState, useCallback, useEffect } from 'react';
import { Card, Icon, Button, Avatar, Input, List, Comment, Form } from 'antd';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_COMMENT_REQUEST, LOAD_COMMENTS_REQUEST, UNLIKE_POST_REQUEST, LIKE_POST_REQUEST, RETWEET_REQUEST } from '../reducers/post';
import PostImages from './PostImages';

const PostCard = ({post}) => {
    const [commentFormOpened, setCommentFormOpened] = useState(false);
    const [commentText, setCommentText] = useState('');
    const { me } = useSelector(state => state.user);
    const { commentAdded, isAddingComment } = useSelector(state => state.post);
    const dispatch = useDispatch();

    const liked = me && post.Likers && post.Likers.find(v => v.id === me.id);

    const onToggleComment = useCallback(() => {
        setCommentFormOpened(prev => !prev);
        if (!commentFormOpened) {
            dispatch({
                type: LOAD_COMMENTS_REQUEST,
                data: post.id,
            });
        }
    }, []);

    const onSubmitComment = useCallback((e) => {
        e.preventDefault();
        if(!me){
            return alert('로그인이 필요합니다.');
        }
        return dispatch({
            type: ADD_COMMENT_REQUEST,
            data: {
                postId: post.id,
                content: commentText,
            },
        });
    }, [me && me.id, commentText]);

    useEffect(() => {
        setCommentText('');
    }, [commentAdded === true]);

    const onChangeCommentText = useCallback((e) => {
        setCommentText(e.target.value);
    }, []);

    const onToggleLike = useCallback(() => {
        if (!me) {
            return alret('로그인이 필요합니다.');
        }
        if (liked) {
            dispatch({
                type: UNLIKE_POST_REQUEST,
                data: post.id,
            });
        } else {    //좋아요 안 누른 상태
            dispatch({
                type: LIKE_POST_REQUEST,
                data: post.id,
            });
        }
    }, [me && me.id, post && post.id, liked]);

    const onRetweet = useCallback(() => {
        if (!me) {
            return alert('로그인이 필요합니다.');
        }
        return dispatch({
            type: RETWEET_REQUEST,
            data: post.id,
        })
    }, [me && me.id, post && post.id]);

    return(
    <div>
        <Card
            key={+post.createdAt}
            cover={post.Images && <PostImages images={post.Images}/>}
            actions={[
                <Icon type="retweet" key="retweet" onClick={onRetweet}/>,
                <Icon type="heart" key="heart" theme={liked ? 'twoTone' : 'outlined'} twoToneColor="#eb2f96" onClick={onToggleLike}/>,
                <Icon type="message" key="message" onClick={onToggleComment}/>,
                <Icon type="ellipsis" key="ellipsis" />
            ]}
            extra={<Button>팔로우</Button>}
        >
            <Card.Meta
                //`/user/${post.User.id}`는 서버 주소
                //동적 주소를 가진 애들은 객체형식으로
                //query는 프론트주소 as는 서버주소
                avatar={<Link href={{pathname: '/user', query: {id: post.User.id}}} as={`/user/${post.User.id}`}><a><Avatar>{post.User.nickname[0]}</Avatar></a></Link>}
                title={post.User.nickname}
                // 정규 표현식을 사용하여 split으로 나눠준다. #어쩌고 일경우 링크 달아주고 아닌 경우엔 그냥 출력
                description={(<div>{post.content.split(/(#[^\s]+)/g).map((v) => {
                    if(v.match(/#[^\s]+/)){
                        return(
                            <Link href={{pathname: '/hashtag', query: {tag: v.slice(1)}}} as={`/hashtag/${v.slice(1)}`} key={v}><a>{v}</a></Link>
                        );
                    };
                    return v;
                })}
                </div>)} //a tag X => Link
            />
        </Card>
        {commentFormOpened && (
            <>
                <Form onSubmit={onSubmitComment}>
                    <Form.Item>
                        <Input.TextArea rows={4} value={commentText} onChange={onChangeCommentText} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={isAddingComment}>삐약</Button>
                </Form>
                <List 
                    header={`${post.Comments ? post.Comments.length : 0} 댓글`}
                    itemLayout = "horizontal"
                    dataSource = {post.Comments || []}
                    renderItem = {item => (
                        <li>
                            <Comment 
                                author={item.User.nickname}
                                avatar={<Link href={{pathname: '/user', query: `/user/${item.User.id}`}} as={`/user/${item.User.id}`}><a><Avatar>{item.User.nickname[0]}</Avatar></a></Link>}
                                content={item.content}
                            />
                        </li>
                    )}
                />
            </>
        )}
    </div>
    );
};

PostCard.propTypes = {
    post: PropTypes.shape({
        User: PropTypes.object,
        content: PropTypes.string,
        img: PropTypes.string, 
        createdAt: PropTypes.object,
    }),
};

export default PostCard;