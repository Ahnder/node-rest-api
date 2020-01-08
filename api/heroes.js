const express = require('express');
const mongoose = require('mongoose');
const Hero = require('../models/hero');
const router = express.Router();


// Index
router.get('/', function(req, res, next) {
    let query = {};
    if (req.query.name) query.name = { $regex:req.query.name, $options:'i' };

    Hero.find(query)
        .sort({ id: 1 })
        .exec((err, heroes) => {
            if (err) {
                res.status(500);
                res.json({ success: false, message: err });
            } else {
                res.json({ success: true, data: heroes });
            }
        });
});

// Show
router.get('/:id', function(req, res, next) {
    Hero.findOne({ id:req.params.id })
        .exec((err, hero) => {
            if (err) {
                res.status(500);
                res.json({ success: false, message: err });
            } else if (!hero) {
                res.json({ success: false, message: "Hero Not Found" });
            } else {
                res.json({ success: true, data: hero });
            }
        });
});

// create
router.post('/', function(req, res, next) {
    Hero.findOne({})
        .sort({ id: -1 })
        .exec((err, hero) => {
            if (err) {
                res.status(500);
                return res.json({ success: false, message: err });
            } else {
                res.locals.lastId = hero ? hero.id : 0;
                next();
            }
        });
}, function(req, res, next) {
    let newHero = new Hero(req.body);
    newHero.id = res.locals.lastId + 1;
    newHero.save((err, hero) => {
        if (err) {
            res.status(500);
            res.json({ success: false, message: err });
        } else {
            res.json({ success: true, data: hero });
        }
    });
});

// Update
router.put('/:id', function(req, res, next) {
    Hero.findOneAndUpdate({ id:req.params.id }, req.body)
        .exec((err, hero) => {
            if (err) {
                res.status(500);
                res.json({ success: false, message: err });
            } else if (!hero) {
                res.json({ success: false, message: "Hero Not Found" });
            } else {
                res.json({ success: true });
            }
        });
});

// Destroy
router.delete('/:id', function(req, res, next) {
    Hero.findOneAndRemove({ id:req.params.id })
        .exec((err, hero) => {
            if (err) {
                res.status(500);
                res.json({ success: false, message: err });
            } else if (!hero) {
                res.json({ success: false, message: "Hero Not Found" });
            } else {
                res.json({ success: true });
            }
        });
});


module.exports = router;