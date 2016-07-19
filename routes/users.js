'use strict';

const express = require('express');
const request = require('request');

const User = require('../models/user');
const Business = require('../models/business');


let router = express.Router();

//    users.js
//    /api/users
router.get('/', User.authMiddleware, (req,res) => {
  User.find({}, (err, users) => {
    res.status(err ? 400 : 200).send(err || users)
  })
})

router.get('/profile', User.authMiddleware, (req, res) => {
  console.log('req.user:', req.user);
  res.send(req.user);
});

router.post('/login', (req, res) => {
  User.authenticate(req.body, (err, token) => {
    res.status(err ? 400 : 200).send(err || {token: token});
  })
})

router.post('/signup', (req, res) => {
  User.register(req.body, (err, token) => {
    res.status(err ? 400 : 200).send(err || {token: token});
  })
})

router.post('/favorite', User.authMiddleware, (req, res) => {
  User.findById(req.user._id, (err, user) => {
    if(err) res.status(400).send(err)

    let favorite = {
      id: req.body.id,
      name: req.body.name
    }
    let index = user.favorites.indexOf(user.favorites.filter(item => {
      return item.id == req.body.id
    })[0])

    console.log('index:', index);

    if( index > -1) {
      res.status(400).send(err)
    } else {
      user.favorites.push(favorite)

      user.save(err => {
        res.status(err? 400: 200).send(err);
      })

    }


  })
})

router.get('/showFavorites', User.authMiddleware, (req, res) => {

  User.findOne(req.user._id, (err, user) => {
    res.status(err? 400:200).send(err || user)
  })
} )

router.put('/:id', User.authMiddleware, (req, res) => {
  User.findOne({'_id': req.user._id}, (err, user) => {
    if(err) res.status(400).send(err);
    if(user) {
      let index = user.favorites.indexOf(user.favorites.filter(item => {
        return item._id == req.params.id
      })[0])

      if(index !== -1) {
        user.favorites.splice(index, 1)

        user.save(err => {
          res.status(err? 400:200).send(err);
        })
      }
    }
  })
})

router.get('/total/:id', User.authMiddleware, (req, res) => {
  console.log('req.params.id', req.params.id);
  User.find({favorites: { $elemMatch: {id: req.params.id}}}, (err, user) => {
    res.status(err ? 400: 200).send(err || user)
  })
})



// router.put('/:id', User.authMiddleware, (req,res) => {
//   User.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, user) => {
//     res.status(err ? 400: 200).send(err || user);
//   })
// })


module.exports = router;
