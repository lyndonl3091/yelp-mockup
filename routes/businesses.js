'use strict';

const express = require('express');
const request = require('request');

var Yelp = require('yelp');

var yelp = new Yelp({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  token: process.env.TOKEN,
  token_secret: process.env.TOKEN_SECRET,
});

const Business = require('../models/business');

let router = express.Router();




router.post('/search', (req, res) => {
  console.log('req.body:', req.body);


  yelp.search({term: req.body.term, location: req.body.location}, (err, data) => {
    console.log('err:', err);
    res.status(err? 400 : 200).send(err || data)
  })

})

router.get('/:id', (req, res) => {

  yelp.business(req.params.id, function(err, data) {
  res.status(err? 400:200).send(err || data)
});

})












module.exports = router;
