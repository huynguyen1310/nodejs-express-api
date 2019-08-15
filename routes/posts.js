const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get('/' , async (req,res) => {
    try {
        const posts = await Post.find();
        res.json(posts)
    } catch (err) {
        res.json({message : err});        
    }
});

router.post('/', async (req,res) => {
    const post = new Post({
        title : req.body.title,
        desc : req.body.desc
    });

    try {
        const savedPost = post.save();
        res.json(savedPost);
    } catch (err) {
        res.json({message : err});
    }
});

router.get('/:id' , async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.json(post)
    } catch (err) {
        res.json({message : err});                
    }
});

router.patch('/:id' , async (req,res) => {
    try {
        const post = await Post.updateOne(
            {_id : req.params.id},
            {$set : {title : req.body.title , desc : req.body.desc}}
        );

        res.json(post)
    } catch (err) {
        res.json({message : err});                
    }
});

router.delete('/:id' , async (req,res) => {
    try {
        const post = await Post.remove({_id : req.params.id});
        res.json(post)
    } catch (err) {
        res.json({message : err});                
    }
});


module.exports = router;