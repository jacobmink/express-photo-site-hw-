const express = require('express');
const router = express.Router();
const Photo = require('../models/photos');
const User = require('../models/users');

// new
router.route('/new')
    .get(async (req,res)=>{
        try{
            const foundUsers = await User.find({});
            res.render('photos/new.ejs', {
                users: foundUsers
            });
        }catch(err){
            res.send(err);
        }
    });

router.route('/')
    // index
    .get(async (req,res)=>{
        try{
            const foundPhotos = await Photo.find({});
            res.render('photos/index.ejs', {
                photos: foundPhotos
            });
        }catch(err){
            res.send(err);
        }
    })
    // post
    .post(async (req,res)=>{
        try{
            const foundUser = await User.findById(req.body.userId);
            const newPhoto = await Photo.create(req.body);
            foundUser.photos.push(newPhoto);
            await foundUser.save();
            res.redirect('/photos');
        }catch(err){
            res.send(err);
        }
    });

router.route('/:id')
    // show
    .get(async (req,res)=>{
        try{
            const foundPhoto = await Photo.findById(req.params.id);
            const foundUser = await User.findOne({'photos._id': req.params.id});
            res.render('photos/show.ejs', {
                photo: foundPhoto,
                user: foundUser
            });
        }catch(err){
            res.send(err);
        }
    })
    // update
    .put(async (req,res)=>{
        try{
            const updatedPhoto = await Photo.findByIdAndUpdate(req.params.id, req.body, {new: true});
            const foundUser = await User.findOne({'photos._id': req.params.id});

            if(foundUser._id.toString() !== req.body.userId){
                foundUser.photos.id(req.params.id).remove();
                await foundUser.save();
                const newUser = await User.findById(req.body.userId);
                newUser.photos.push(updatedPhoto);
                await newUser.save();
                res.redirect(`/photos/${req.params.id}`);
            }else{
                const thisPhoto = foundUser.photos.id(req.params.id);
                thisPhoto.set(req.body);
                await foundUser.save();
                res.redirect(`/photos/${req.params.id}`);
            }
        }catch(err){
            res.send(err);
        }
    })
    // delete
    .delete(async (req,res)=>{
        try{
            await Photo.findByIdAndDelete(req.params.id);
            const foundUser = await User.findOne({'photos._id': req.params.id});
            foundUser.photos.id(req.params.id).remove();
            await foundUser.save();
            res.redirect('/photos');
        }catch(err){
            res.send(err);
        }
    })

// edit
router.route('/:id/edit')
    .get(async (req,res)=>{
        try{
            const foundPhoto = await Photo.findById(req.params.id);
            const allUsers = await User.find({});
            const foundUser = await User.findOne({'photos._id': req.params.id});
            res.render('photos/edit.ejs', {
                photo: foundPhoto,
                allUsers: allUsers,
                user: foundUser
            });
        }catch(err){
            res.send(err);
        }
    });

module.exports = router;