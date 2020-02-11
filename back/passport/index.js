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
