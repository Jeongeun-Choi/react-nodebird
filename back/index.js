const express = require('express');

const db = require('./models');
const userAPIRouter = require('./routes/user'); //라우터 합침
const postAPIRouter = require('./routes/post');
const postsAPIRouter = require('./routes/posts');

const app = express();
db.sequelize.sync();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//요거를 라우터라고하고 (req, res)부분을 컨트롤러라고함
app.get('/', (req, res) => {    //'/'은 로컬호스트 뒤에 붙는 주소! 프론트에서 이쪽 서버에 요청을 하면 'Hello server'라고 응답해줌
    res.send('Hello, server');
});

app.use('/api/user', userAPIRouter);
app.use('/api/post', postAPIRouter);
app.use('/api/posts', postsAPIRouter);

app.listen(3065, ()=>{
    console.log('server is running on http://localhost:3065');
});