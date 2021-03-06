const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');   //여기에 비밀번호나 보안키 설정해둠.

const passportConfig = require('./passport');
const db = require('./models');
const userAPIRouter = require('./routes/user'); //라우터 합침
const postAPIRouter = require('./routes/post');
const postsAPIRouter = require('./routes/posts');
const hashtagAPIRouter = require('./routes/hashtag');
const passport = require('passport');

dotenv.config();
const app = express();
db.sequelize.sync();
passportConfig();

//use쓰면 뭐 미들웨어? 사용 할 수 있다
app.use(morgan('dev')); //요청 들어오는거에 대해 로그가 남음
app.use('/', express.static('uploads'));    //uploads 폴더를 루트 폴더인것처럼 쓸 수 있다.
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: true,   //요청 주소와 같게
    credentials: true
}));    //쿠키 교환 할 수 있게됨
app.use(cookieParser(process.env.COOKIE_SECRET));    //secret
app.use(expressSession({
    resave: false,              //매번 세션 강제 저장
    saveUninitialized: false,   //빈 값도 저장
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,  //https를 쓸 때 true
    },
    name: 'rnbck',
}));
app.use(passport.initialize());
app.use(passport.session());    //expressSession 밑에 적어야함, expressSession을 내부적으로 사용.

//요거를 라우터라고하고 (req, res)부분을 컨트롤러라고함
//'/'은 로컬호스트 뒤에 붙는 주소! 프론트에서 이쪽 서버에 요청을 하면 'Hello server'라고 응답해줌
  
app.use('/api/user', userAPIRouter);
app.use('/api/post', postAPIRouter);
app.use('/api/posts', postsAPIRouter);
app.use('/api/hashtag', hashtagAPIRouter);

app.listen(3065, ()=>{
    console.log('server is running on http://localhost:3065');
});