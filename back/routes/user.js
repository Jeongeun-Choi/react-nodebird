//라우터 분리 
//프론트앤드에서 import, export 사용
//백엔드에선 require, module.exports 사용

const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../modules');

const router = express.Router();

//공통된 부분 제거 ex) /api/user
//API는 다른 서비스가 내 서비스의 기능을 실행할 수 있게 열어둔 창구 
router.get('/', (req, res) => {     // /api/user/

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
        const hashedPassword = await bcrypt.hash(req.bodypassword, 12); //비밀번호 암호화
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
router.get('/:id', (req, res) => {    //남의 정보를 가져오는 것

});
router.get('/logout', (req, res) => {

});
router.post('/login', (req, res) => {

});
router.get('/:id/follow', (req, res) => {
    
});
router.post('/:id/follow', (req, res) => {

});
router.delete('/:id/follow', (req, res) => {
    
});
router.delete('/:id/follower', (req, res) => {
    
});
router.get('/:id/posts', (req, res) => {
    
});
module.exports = Router;