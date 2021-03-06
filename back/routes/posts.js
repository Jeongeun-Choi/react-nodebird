const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/', async(req, res, next) => { //GET /api/posts
    try{
        let where = {};
        if(parseInt(req.query.lastId, 10)){
            where = {
                id: {
                    [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10)   //sequelize operator 찾아보기
                },
            };
        }
        const posts = await db.Post.findAll({
            where,
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }, {
                model: db.Image,
            }, {
                model: db.User,
                through: 'Like',
                as: 'Likers',
                attributes: ['id'],
            }, {
                model: db.Post,
                as: 'Retweet',
                include: [{
                    model: db.User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: db.Image
                }],
            }],
            order: [['createdAt', 'DESC']],   //최신 게시글을 위에 올리고싶을때
            limit: parseInt(req.query.limit, 10)
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