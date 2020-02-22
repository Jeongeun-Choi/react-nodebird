const express = require('express');
const db = require('../models');

const router = express.Router();

router.post('/', async(req, res, next) => {    //POST /api/post
    try{
        const hashtags = req.body.content.match(/#[^\s]+/g); //정규표현식 알아두면 유용하게 쓰인다 , regexr.com 정규표현식 확인 사이트
        const newPost = await db.Post.create({
            content: req.body.content,
            UserId: req.user.id,
        });
        if (hashtags){
            const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({   //findOrCreate는 없으면 만들고, 있으면 찾는다!
                where: {name: tag.slice(1).toLowerCase()}
            })));
            await newPost.addHashtags(result.map(r => r[0]));
        }
        //const User = await newPost.getUser();
        //newPost.User =User;
        //res.json(newPost);
        const fullPost = await db.Post.findOne({    //작성자
            where: { id: newPost.id },
            include: [{
                model: db.User,
            }],
        });
        res.json(fullPost);
    }catch(e) {
        console.error(e);
        next(e);
    }
});

router.post('/images', (req, res) => {

});

module.exports = router;