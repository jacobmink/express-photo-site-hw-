const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Photo = require('../models/photos');

// new
router.get('/new', (req,res)=>{
    res.render('users/new.ejs');
});

router.route('/')
    // index
    .get(async (req,res)=>{
        try{
            const data = await User.find(req.body);
            res.render('users/index.ejs', {
                users: data
            });
        }catch(err){
            res.send(err);
        }
    })
    // post
    .post(async (req,res)=>{
        try{
            await User.create(req.body);
            res.redirect('/users');
        }catch(err){
            res.send(err);
        }
    });

router.route('/:id')
    // show
    .get(async (req,res)=>{
        try{
            const data = await User.findById(req.params.id);
            res.render('users/show.ejs', {
                user: data
            });
        }catch(err){
            res.send(err);
        }
    })
    // update
    .put(async (req,res)=>{
        try{
            await User.findByIdAndUpdate(req.params.id, req.body);
            res.redirect(`/users/${req.params.id}`);
        }catch(err){
            res.send(err);
        }
    })
    // delete
    .delete(async (req,res)=>{
        try{
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            const photoIds = [];
            deletedUser.photos.forEach((photo)=>{
                photoIds.push(photo._id);
            });
            await Photo.deleteMany({_id:{$in: photoIds}});
            res.redirect('/users');
        }catch(err){
            res.send(err);
        }
    });

    // edit
router.route('/:id/edit')
    .get(async (req,res)=>{
        try{
            const data = await User.findById(req.params.id);
            res.render('users/edit.ejs', {
                user: data
            });
        }catch(err){
            res.send(err);
        }
    });

module.exports = router;