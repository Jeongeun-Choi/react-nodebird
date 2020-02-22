const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/', async(req, res, next) => { //GET /api/posts
    try{
        const posts = await db.Post.findAll({
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }],
            order: [['createAt', 'DESC']]   //최신 게시글을 위에 올리고싶을때
        });
        res.json(posts);
    }catch(e) {
        console.error(e);
        next(e);
    }
});

router.post('/images', (req, res) => {

});

module.exports = router;