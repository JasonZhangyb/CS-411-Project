
//Get a router instance
const express = require('express');
const router = express.Router();

//Grab configs for Twitter
const Twitter = require('../config/Twitter');

//Connect to user database
//No reason not to use the crypto version of the user model (because crypto)
//const User = require('../models/UserWithCrypto');

const passport = require('passport');
const Strategy = require('passport-twitter').Strategy;

passport.use(new Strategy({
    consumerKey: Twitter.CONSUMER_KEY,
    consumerSecret: Twitter.CONSUMER_SECRET,
    callbackURL: Twitter.CALLBACK_URL
}, function (token, tokenSecret, profile, callback){
    return callback(null, profile);
}));

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

router.get('/twitter',
    passport.authenticate('twitter'));

router.get('/callback', passport.authenticate('twitter', {
    failureRedirect: '/'
}), function (req, res) {
    res.redirect('/')
})

module.exports = router;