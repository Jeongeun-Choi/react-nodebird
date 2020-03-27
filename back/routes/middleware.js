exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){  //로그인 했는지 안했는지
        next(); //다음 미들웨어로 간다.
    } else{
        res.status(401).send('로그인이 필요합니다.');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){ 
        next(); //다음 미들웨어로 간다.
    } else{
        res.status(401).send('로그인한 사용자는 접근할 수 없습니다.');
    }
};