const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/:tag', async (req, res, next) => {
    try{
        const posts = await db.Post.findAll({
            include: [{
                model: db.Hashtag,
                where: {name: decodeURIComponent(req.params.tag)}, //주소창에 한글 입력하면 이상하게되어서 decodeURIComponent로 감싸고 서버로 넘겨준다.
            }, {
                model: db.User,
                attributes: ['id', 'nickname'],
            }, {
                model: db.Image,
            },{
                model: db.User,
                through: 'Like',
                as: 'Likers',
                attributes: ['id'],
            },{
                model: db.Post,
                as: 'Retweet',
                include: [{
                    model: db.User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: db.Image
                }],
            }],
        });
        res.json(posts);
    } catch(e){
        console.error(e);
        next(e);
    }
});

module.exports = router;