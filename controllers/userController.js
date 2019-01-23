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
    .get((req,res)=>{
        User.find(req.body, (err,data)=>{
            if(err){
                res.send(err);
            }
            res.render('users/index.ejs', {
                users: data
            });
        });
    })
    // post
    .post((req,res)=>{
        User.create(req.body, (err,data)=>{
            if(err){
                res.send(err);
            }
            res.redirect('/users');
        });
    });

router.route('/:id')
    // show
    .get((req,res)=>{
        User.findById(req.params.id, (err,data)=>{
            if(err){
                res.send(err);
            }
            res.render('users/show.ejs', {
                user: data
            });
        });
    })
    // update
    .put((req,res)=>{
        User.findByIdAndUpdate(req.params.id, req.body, (err,data)=>{
            if(err){
                res.send(err);
            }
            res.redirect(`/users/${req.params.id}`);
        });
    })
    // delete
    .delete((req,res)=>{
        User.findByIdAndDelete(req.params.id, (err,deletedUser)=>{
            if(err){
                res.send(err);
            }else{
                const photoIds = [];
                deletedUser.photos.forEach((photo)=>{
                    photoIds.push(photo._id);
                });
                Photo.deleteMany({_id:{$in: photoIds}}, (err,data)=>{
                    if(err){
                        res.send(err);
                    }
                    res.redirect('/users');
                });
            }
        });
    });

    // edit
router.route('/:id/edit')
    .get((req,res)=>{
        User.findById(req.params.id, (err,data)=>{
            if(err){
                res.send(err);
            }
            res.render('users/edit.ejs', {
                user: data
            });
        });
    });







module.exports = router;