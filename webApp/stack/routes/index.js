var express = require('express');
var router = express.Router();
var request = require("request");

//added
const Recipe = require('../models/Recipes');
const Menus = require('../models/Menus');
const Restaurants = require('../models/Restaurants');

let token1 = require('../config/Edamam').API_ID;
let token2 = require('../config/Edamam').API_KEY;
let token3 = require('../config/EatStreet').API_KEY;

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Recipe Search <3' });
});


/* POST to Food page*/
router.post('/food', function(req, res) {

    // get the user input
    var term = String(req.body.search);

    // count the items in cache with param term
    Recipe.count({term:term},function(err, result){
        //console.log(result);
        // if there are items in the cache, render them to food page
        if(result != 0){
            Recipe.find({term:term}, function (err, result) {

                var food = {hits:[]};
                for (var i in result){
                    var item = result[i];
                    food.hits.push({"recipe":{
                        "term":item.term,
                        "label":item.label,
                        "image":item.image,
                        "url":item.recipe_url
                    }});
                }
                //console.log(food.hits);
                res.render('food', {title: 'Recipes', result:food});

            });
        }
        // if there is no item in the cache, call recipe API and store them into cache; render API response to food page
        else{
            request ('https://api.edamam.com/search?q='+ req.body.search + '&app_id=' + token1 +'&app_key=' + token2 + '&to=30', function (error, response, body) {
                if (error) throw new Error(error);

                var result = JSON.parse(body);

                //console.log(result.hits[0].recipe.label);
                for (i = 0; i < result.hits.length; i++) {
                    var newRecipeObj = new Recipe({
                        term: term, label: result.hits[i].recipe.label,
                        image: result.hits[i].recipe.image, recipe_url: result.hits[i].recipe.url
                    });
                    newRecipeObj.save(err => {
                        if (err) return res.status(500).send(err);
                    });
                }

                res.render('food', {title: 'Recipes', result: JSON.parse(body)});
            });
        }
    })

});

/* POST to Restaurant page*/
router.post('/restaurant', function(req, res){
    //console.log(req.body);
    console.log(req.body.search);
    // get user input and food label
    var test = String(req.body.search);
    var food = String(req.body.label).split(' ').join('&');

    // count the items in cache with param term and food
    Restaurants.count({term: test, food: food}, function (err, result) {
        if (req.body.search == '') {
            res.render('redirect', {type: 'recipe', label: req.body.label})
        }

        else{
            // if there are items in the cache, render them to restaurants page
            if (result != 0) {
                var test = String(req.body.search);
                var food = String(req.body.label).split(' ').join('&');
                Restaurants.find({term: test, food: food}, function (err, result) {
                    console.log(food);
                    var jres = {restaurants: []};
                    for (var i in result) {
                        var x = result[i];
                        jres.restaurants.push({
                            "term": test,
                            "name": x.name,
                            "logoUrl": x.logoURL,
                            "streetAddress": x.street,
                            "city": x.city,
                            "state": x.state,
                            "zip": x.zip,
                            "apiKey": x.apiMenuKey
                        });
                    }
                    ;
                    res.render('restaurant', {title: 'Restaurants', result: jres});

                });
            }
            // if there is no item in the cache, call restaurant API and store them into cache; render API response to restaurant page
            else {

                var INPUT = req.body.search
                var food = String(req.body.label).split(' ').join('&')
                if (req.body.label != null) {
                    console.log(req.body.label);
                    req.body.search = req.body.search + '&search=' + food;
                }
                request('https://api.eatstreet.com/publicapi/v1/restaurant/search?method=both&street-address=' + req.body.search + '&access-token=' + token3, function (error, response, body) {
                    if (error) throw new Error(error);
                    var Res = JSON.parse(body).restaurants;
                    console.log("Got here!")
                    for (var i = 0; i < Res.length; i++) {
                        const new_res = new Restaurants({
                            term: INPUT,
                            food: food,
                            apiMenuKey: Res[i].apiKey,
                            name: Res[i].name,
                            street: Res[i].streetAddress,
                            city: Res[i].city,
                            state: Res[i].state,
                            zip: Res[i].zip,
                            logoURL: Res[i].logoUrl,
                            PhoneNum: Res[i].phone
                        });
                        new_res.save(err => {
                            if (err) return res.status(500).send(err);
                        });
                    }

                    res.render('restaurant', {title: 'Restaurants', result: JSON.parse(body)});
                });
            }
        }
    })

});

/* POST to Menu page*/
router.post('/menu', function(req, res) {

    var resKey = req.body.id;

    // count the items in cache with param resKey
    Menus.count({resKey: resKey},function(err, result) {

        if (result != 0) {
            Menus.find({resKey: resKey}, function (err, result) {

                res.render('menu', {result: result, type: "cache"});

            });
        }
        // if there is no item in the cache, call menus API and store them into cache; render API response to menu page
        else {
            request("https://api.eatstreet.com/publicapi/v1/restaurant/" + resKey + "/menu?access-token=" + token3, function (error, response, body) {
                if (error) throw new Error(error);
                console.log(body);
                var Menu = JSON.parse(body);

                for (var i = 0; i < Menu.length; i++) {
                    var item = [];
                    for (var j = 0; j < Menu[i].items.length; j++) {
                        item.push(Menu[i].items[j].name);
                    }
                    const new_menu = new Menus({resKey: resKey, category: Menu[i].name, name: item})
                    new_menu.save(err => {
                        if (err) return res.status(500).send(err);
                    });
                }
                res.render('menu', {result: JSON.parse(body)});
            });
        }
    })
});


router.post('/main', function(req, res) {
    res.render('main');
});

router.get('/main', function(req, res) {
    res.render('main');
});

module.exports = router;
