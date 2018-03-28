var express = require('express');
var router = express.Router();
var request = require("request");


let token = require('../config/Food2Fork').API_KEY

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Recipe Search <3' });
});

router.post('/recipe', function(req, res) {

    console.log(req.body);
    console.log(req.body.search);
    request('http://food2fork.com/api/search?key='+ token +'&q=' + req.body.search, function (error, response, body){
        if (error) throw new Error(error);
        console.log(response);
        res.render('recipe', {title: 'Recipes', result: JSON.parse(JSON.stringify(response))});
    });

});

module.exports = router;
