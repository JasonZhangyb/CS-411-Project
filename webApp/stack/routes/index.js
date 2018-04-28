var express = require('express');
var router = express.Router();
var request = require("request");


let token1 = require('../config/Edamam').API_ID;
let token2 = require('../config/Edamam').API_KEY;
let token3 = require('../config/EatStreet').API_KEY;

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Recipe Search <3' });
});

router.post('/food', function(req, res) {

    //console.log(req.body);
    //console.log(req.body.search);

    // search in cache recipes with req.body.search


    //get api response values


    request('https://api.edamam.com/search?q='+ req.body.search + '&app_id=' + token1 +'&app_key=' + token2 + '&to=30', function (error, response, body){
        if (error) throw new Error(error);
        //console.log(body.hits);
        //console.log(response);
        res.render('food', {title: 'Recipes', result: JSON.parse(body)});
    });

});


router.post('/restaurant', function(req, res){
    console.log(req.body);
    console.log(req.body.search);
    if (req.body.search == '') {
        res.render('redirect', {type: 'recipe', label: req.body.label})
    } else {
        if (req.body.label != null)
            req.body.search = req.body.search + '&search=' + req.body.label
        request('https://api.eatstreet.com/publicapi/v1/restaurant/search?method=both&street-address=' + req.body.search + '&access-token=' + token3, function (error, response, body){
            if (error) throw new Error(error);
            console.log(body);
            res.render('restaurant', {title: 'Restaurants', result: JSON.parse(body)});
        });
    }

});



router.post('/menu', function(req, res) {
    console.log(req.body.id);
    request("https://api.eatstreet.com/publicapi/v1/restaurant/" + req.body.id + "/menu?access-token=" + token3, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
        res.render('menu', {result: JSON.parse(body)});
    });
});

module.exports = router;
