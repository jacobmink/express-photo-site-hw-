const express = require('express');
const router = express.Router();
const Photo = require('../models/photos');
const User = require('../models/users');

// new
router.route('/new')
    .get((req,res)=>{
        User.find({}, (err,foundUsers)=>{
            if(err){
                res.send(err);
            }
            res.render('photos/new.ejs', {
                users: foundUsers
            });
        });
    });

router.route('/')
    // index
    .get((req,res)=>{
        Photo.find({}, (err,foundPhotos)=>{
            if(err){
                res.send(err);
            }
            res.render('photos/index.ejs', {
                photos: foundPhotos
            });
        });
    })
    // post
    .post((req,res)=>{
        User.findById(req.body.userId, (err,foundUser)=>{
            if(err){
                res.send(err);
            }
            Photo.create(req.body, (err,newPhoto)=>{
                if(err){
                    res.send(err);
                }
                foundUser.photos.push(newPhoto);
                foundUser.save((err,data)=>{
                    if(err){
                        res.send(err);
                    }
                    res.redirect('/photos');
                });// end save
            });// end new photo
        });// end user query
    });

router.route('/:id')
    // show
    .get((req,res)=>{
        Photo.findById(req.params.id, (err,foundPhoto)=>{
            if(err){
                res.send(err);
            }
            User.findOne({'photos._id': req.params.id}, (err,foundUser)=>{
                if(err){
                    res.send(err);
                }
                res.render('photos/show.ejs', {
                    photo: foundPhoto,
                    user: foundUser
                })
            })
            
        })
    })
    // update
    .put((req,res)=>{
        Photo.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err,updatedPhoto)=>{
            if(err){
                res.send(err);
            }
            User.findOne({'photos._id': req.params.id}, (err,foundUser)=>{
                if(err){
                    res.send(err);
                }
                if(foundUser._id.toString() !== req.body.userId){
                    foundUser.photos.id(req.params.id).remove();
                    foundUser.save((err,savedFoundUser)=>{
                        if(err){
                            res.send(err);
                        }
                        User.findById(req.body.userId, (err,newUser)=>{
                            if(err){
                                res.send(err);
                            }
                            newUser.photos.push(updatedPhoto);
                            newUser.save((err,savedNewUser)=>{
                                if(err){
                                    res.send(err);
                                }
                                res.redirect(`/photos/${req.params.id}`);
                            });// end savedNewUser
                        });// end new user query
                    });// end savedFoundUser
                }else{
                    const thisPhoto = foundUser.photos.id(req.params.id);
                    thisPhoto.set(req.body);
                    foundUser.save((err,data)=>{
                        if(err){
                            res.send(err);
                        }
                        res.redirect(`/photos/${req.params.id}`);
                    });// end save
                }// end else
            });// end og user query
        });// end photo query
    })
    // delete
    .delete((req,res)=>{
        Photo.findByIdAndDelete(req.params.id, (err,deletedPhoto)=>{
            if(err){
                res.send(err);
            }
            User.findOne({'photos._id': req.params.id}, (err,foundUser)=>{
                if(err){
                    res.send(err);
                }else{
                    foundUser.photos.id(req.params.id).remove();
                    foundUser.save((err,data)=>{
                        if(err){
                            res.send(err);
                        }
                        res.redirect('/photos');
                    });
                }
            });
        });
    })

// edit
router.route('/:id/edit')
    .get((req,res)=>{
        Photo.findById(req.params.id, (err,foundPhoto)=>{
            if(err){
                res.send(err);
            }
            User.find({}, (err,allUsers)=>{
                if(err){
                    res.send(err);
                }
                User.findOne({'photos._id': req.params.id}, (err,foundUser)=>{
                    if(err){
                        res.send(err);
                    }
                    res.render('photos/edit.ejs', {
                        photo: foundPhoto,
                        allUsers: allUsers,
                        user: foundUser
                    });
                });
            });
        });
    });











module.exports = router;