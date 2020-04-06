//라우터 분리 
//프론트앤드에서 import, export 사용
//백엔드에선 require, module.exports 사용

const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');
const {isLoggedIn} = require('./middleware');

const router = express.Router();

//공통된 부분 제거 ex) /api/user
//API는 다른 서비스가 내 서비스의 기능을 실행할 수 있게 열어둔 창구 
router.get('/', isLoggedIn, (req, res) => {     // /api/user/
    const user = Object.assign({}, req.user.toJSON());
    delete user.password;
    return res.json(user);
});
router.post('/', async (req, res, next) => {    // POST /api/user 회원가입
    try {
        const exUser = await db.User.findOne({
            where: {
                userId: req.body.userId,
            },
        });
        if(exUser) {
            return res.status(403).send('이미 사용중인 아이디입니다.');
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12); //비밀번호 암호화, salt는 10~13 사이로
        const newUser = await db.User.create({
            nickname: req.body.nickname,
            userId: req.body.userId,
            password: hashedPassword,
        });
        console.log(newUser);
        return res.status(200).json(newUser);
    } catch (e) {
        console.error(e);
        //에러 처리를 여기서 
        return next(e); //에러 났을 경우 프론트에 알아서 에러났다고 알려줌
    }
});
//:id는 req.params.id로 가져올 수 있다. ex)/api/user/3 => 아이디가 3번인 유저의 정보를 가져오겠다
//동적 데이터를 넣어준다.
router.get('/:id', async(req, res, next) => {    //남의 정보를 가져오는 것
    try{
        const user = await db.User.findOne({
            where: { id: parseInt(req.params.id, 10)},
            inclues: [{
                model: db.Post,
                as: 'Posts',
                attributes: ['id'],
            }, {
                model: db.User,
                as: 'Followings',
                attributes: ['id']
            }, {
                model: db.User,
                as: 'Followers',
                attributes: ['id'],
            }],
            attributes: ['id', 'nickname'],
        });
        const jsonUser = user.toJSON();
        jsonUser.Posts = jsonUser.Posts ? jsonUser.Posts.length : 0;
        jsonUser.Followings = jsonUser.Followings ? jsonUser.Followings.length : 0;
        jsonUser.Followers = jsonUser.Followers ? jsonUser.Followers.length : 0;
        res.json(jsonUser);
    } catch(e) {
        console.error(e);
        next(e);
    }
});
router.post('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('logout 성공');
});
router.post('/login', (req, res, next) => {   //POST /api/user/login
    passport.authenticate( 'local', (err, user, info) => {  //done의 첫번째, 두번째, 세번째 인수
        if(err) {
            console.error(err);
            return next(err);
        }     
        if(info) {
            return res.status(401).send(info.reason);
        }
        return req.login(user, async (loginErr) => {
            try{
                if (loginErr) {
                    return next(loginErr);
                }
                const fullUser = await db.User.findOne({
                    where: { id: user.id },
                    include: [{
                        model: db.Post,
                        as: 'Posts',
                        attributes: ['id']
                    }, {
                        model: db.User,
                        as: 'Followings',
                        attributes: ['id']
                    }, {
                        model: db.User,
                        as: 'Followers',
                        attributes: ['id']
                    }], 
                    attributes: ['id', 'nickname', 'userId']    //어떤 데이터만 들고올지 정해줌
                });
                console.log(fullUser);
                return res.json(fullUser);  //프론트에 json 형식으로 보내짐
            } catch(e) {
                next(e);
            }
        });
    })(req, res, next);
});

router.get('/:id/followings', isLoggedIn, async(req, res, next) => {
    try{
        const user = await db.User.findOne({
            where: {id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0},
        });
        const followers = await user.getFollowings({
            attributes: ['id', 'nickname'],
            limit: parseInt(req.query.limit, 10),
            offset: parseInt(req.query.offset, 10)
        });
        res.json(followers);
    } catch(e){
        console.error(e);
        next(e);
    }
});

router.get('/:id/followers', isLoggedIn, async(req, res, next) => {
    try{
        const user = await db.User.findOne({
            where: {id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0},
        }); // req.params.id가 문자열 '0'
        const followers = await user.getFollowers({
            attributes: ['id', 'nickname'],
            limit: parseInt(req.query.limit, 10),
            offset: parseInt(req.query.offset, 10)
        });
        res.json(followers);
    } catch(e){
        console.error(e);
        next(e);
    }
});

router.delete('/:id/follower', isLoggedIn, async (req, res, next) => {
    try{
        const me = await db.User.findOne({
            where: {id: req.user.id},
        });
        await me.removeFollower(req.params.id);
        res.send(req.params.id);
    } catch(e){
        console.error(e);
        next(e);
    }
});

router.post('/:id/follow', isLoggedIn, async(req, res, next) => {
    try {
        const me = await db.User.findOne({
            where: { id: req.user.id },
        });
        await me.addFollowing(req.params.id);
        res.send(req.params.id);
    } catch(e) {
        console.error(e);
        next(e);
    }
});
router.delete('/:id/follow', isLoggedIn, async(req, res, next) => {
    try {
        const me = await db.User.findOne({
            where: { id: req.user.id },
        });
        await me.removeFollowing(req.params.id);
        res.send(req.params.id);
    } catch(e) {
        console.error(e);
        next(e);
    }
});

router.get('/:id/posts', async(req, res, next) => {
    try{
        const posts = await db.Post.findAll({
            where: {
                UserId: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
                RetweetId: null,    //내가 쓴 게시글만 불러오도록한다.
            },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }, {
                model: db.Image,
            }, {
                model: db.User,
                through: 'Like',
                as: 'Likers',
                attributes: ['id'],
            }],
        });
        res.json(posts);
    } catch(e){
        console.error(e);
        next(e);
    }
});

router.patch('/nickname', isLoggedIn, async(req, res, next) => {
    try{
        await db.User.update({
            nickname: req.body.nickname,
        }, {
            where: {id: req.user.id},
        });
        res.send(req.body.nickname);
    } catch(e){
        console.error(e);
        next(e);
    }
});
module.exports = router;