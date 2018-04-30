
//Get a router instance
const express = require('express');
const router = express.Router();

//Grab configs for Twitter
const Twitter = require('../config/Twitter');

//Connect to user database
const User = require('../models/User');

const passport = require('passport');
const Strategy = require('passport-twitter').Strategy;

var passportOption = {
    consumerKey: Twitter.CONSUMER_KEY,
    consumerSecret: Twitter.CONSUMER_SECRET,
    callbackURL: Twitter.CALLBACK_URL}

passport.use(new Strategy(passportOption,
    function (token, tokenSecret, profile, callback){
        User.findOneAndUpdate({userID: profile.id},
            {
                userID: profile.id,
                username: profile.username
            },
            {'upsert': 'true'},
            function(err, result){
                if(err){
                    console.log(err)
                    return callback(err, null)
                }
                else{
                    return callback(null, profile)
                }
            })
    })
)

passport.serializeUser(function (user, callback) {
    //console.log('in serialize, setting id on session:', user.id)
    //done(null, user.id)
    callback(null, user);
})

passport.deserializeUser(function (obj, callback) {
    //console.log('in deserialize with id', id)
    //User.findOne({twitterID: id}, function (err, user) {
    //done(err, user)
    callback(null, obj);
})

//router.get('/success', function (req, res) {
//  res.redirect('/');
//})

router.get('/logout', function (req, res, next) {
    User.findOne({userID: req.user.userID})
        .then(function (err, response) {
            req.logOut()
            res.clearCookie()
            res.status = 401
            res.redirect('/')
        })
})

router.get('/twitter',
    passport.authenticate('twitter'));

router.get('/callback', passport.authenticate('twitter', {
    failureRedirect: '/'
}), function (req, res) {
    res.cookie('userId', res.req.user.id);
    res.cookie('userName', res.req.user.displayName);
    res.cookie('authStatus', 'true');
    res.render('main', {message: 'Welcome '+ req.user.username})
})

module.exports = router;