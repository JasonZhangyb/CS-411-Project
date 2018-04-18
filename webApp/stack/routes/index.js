var express = require('express');
var router = express.Router();
var request = require("request");


let token1 = require('../config/Edamam').API_ID
let token2 = require('../config/Edamam').API_KEY

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Recipe Search <3' });
});

router.post('/recipe', function(req, res) {

    console.log(req.body);
    console.log(req.body.search);
    request('https://api.edamam.com/search?q='+ req.body.search + '&app_id=' + token1 +'&app_key=' + token2 + '&to=30', function (error, response, body){
        if (error) throw new Error(error);
        console.log(body);
        //res.render('recipe', {title: 'Recipes', result: JSON.parse(JSON.stringify(response))});
        res.render('recipe', {title: 'Recipes', result: JSON.parse(body)});
    });

});

module.exports = router;
