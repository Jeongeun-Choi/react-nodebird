const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');   //여기에 비밀번호나 보안키 설정해둠.

const db = require('./models');
const userAPIRouter = require('./routes/user'); //라우터 합침
const postAPIRouter = require('./routes/post');
const postsAPIRouter = require('./routes/posts');

dotenv.config();
const app = express();
db.sequelize.sync();

//use쓰면 뭐 미들웨어? 사용 할 수 있다
app.use(morgan('dev')); //요청 들어오는거에 대해 로그가 남음
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET));    //secret
app.use(expressSession({
    resave: false,              //매번 세션 강제 저장
    saveUninitialized: false,   //빈 값도 저장
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,  //https를 쓸 때 true
    },
}));

//요거를 라우터라고하고 (req, res)부분을 컨트롤러라고함
//'/'은 로컬호스트 뒤에 붙는 주소! 프론트에서 이쪽 서버에 요청을 하면 'Hello server'라고 응답해줌
  
app.use('/api/user', userAPIRouter);
app.use('/api/post', postAPIRouter);
app.use('/api/posts', postsAPIRouter);

app.listen(3065, ()=>{
    console.log('server is running on http://localhost:3065');
});