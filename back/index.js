const express = require('express');

const db = require('./models');

const app = express();
db.sequelize.sync();

app.get('/', (req, res) => {    //'/'은 로컬호스트 뒤에 붙는 주소! 프론트에서 이쪽 서버에 요청을 하면 'Hello server'라고 응답해줌
    res.send('Hello, server');
});

app.get('/about', (req, res) => {
    res.send('Hello, about');
});

app.listen(3065, ()=>{
    console.log('server is running on http://localhost:3065');
});