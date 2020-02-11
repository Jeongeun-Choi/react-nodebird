const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const db = require('../models');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'userId',    //req.body.userId
        passwordField: 'password',  //req.body.password
    }, async (id, password, done) => {
        try{
            const user = await db.User.findOne({where: {userId}});
            if(!user) {
                return done(null, false, {reason: '존재하지 않는 사용자입니다!'})
            }
            const result = await bcrypt.compare(password, user.password);
            if(result){
                return done(null, user);
            }
            return done(null, false, {reason: '비밀번호가 틀립니다'});
        }catch(e) {
            console.error(e);
            return done(e);
        }
    }));
};

//done이 뭔데 서버 에러 발생하면 첫번째 인수에 1 넣어주고, 두번째 인수 성공했을때, 세번째는 로직상 에러가 발생했을 경우(사용자가 존재하지 않을경우)