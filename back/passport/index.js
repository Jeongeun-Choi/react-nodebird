const passport = require('passport');
const db = require('../models');
const local = require('./local');

module.exports = () => {
   
    passport.serializeUser((user, done) => {    //서버쪽에 [{id: 3, cookie: 'asdf'}] 얘만 서버 쪽에 저장
        return done(null, user.id);
    });

    //메모리 검사해서 쿠키랑 연관된 id를 찾고 그를 토대로 유저정보를 DB에서 얻어옴
    passport.deserializeUser(async(id, done) => {
        try{
            const user = await db.User.fineOne({
                where: {id},
            });
            return done(null, user);   //req.user
        } catch(e) {
            console.error(e);
            return done(e);
        }
    });

    local();
};

//프론트에서 서버로는 cookie만 보냄(asdf)
//서버가 쿠키파서, 익스프레스 세션으로 쿠키 검사 후 id: 3 발견
//id: 3이 deserializeUser에 들어감
//req.user로 사용자 정보가 들어감

//요청 보낼때마다 deserializeUser가 실행됨(db 요청 1번씩 실행)
//실무에서는 deserializeUser 결과물 캐싱(한번 찾은 user는 다시 안찾아도 되게)