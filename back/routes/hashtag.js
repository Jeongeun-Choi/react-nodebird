const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/:tag', async (req, res, next) => {
    try{
        const posts = await db.Posts.findAll({
            include: [{
                model: db.Hashtag,
                where: {name: decodeURIComponent(req.params.name)}, //주소창에 한글 입력하면 이상하게되어서 decodeURIComponent로 감싸고 서버로 넘겨준다.
            }, {
                model: db.User,
                attributes: ['id', 'nickname'],
            }],
        });
        res.json(posts);
    } catch(e){
        console.error(e);
        next(e);
    }
});

module.exports = router;