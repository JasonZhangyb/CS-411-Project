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

router.post('/food', function(req, res) {

    // search in cache recipes with req.body.search

    //get api response values
    var term = String(req.body.search);
    //console.log(term);

    Recipe.count({term:term},function(err, result){
        //console.log(result);
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
                console.log(food.hits);
                res.render('food', {title: 'Recipes', result:food});

            });
        }
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


router.post('/restaurant', function(req, res){
    //console.log(req.body);
    console.log(req.body.search);
    var test = String(req.body.search);
    Restaurants.count({term: test},function(err, result){
        if (result != 0){
            //console.log("haha1");
            Restaurants.find({term: test}, function(err, result){
                //console.log("haha2")
                var jres = {restaurants:[]};
                for (var i in result){
                    var x = result[i];
                    jres.restaurants.push({
                        "term":test,
                        "name":x.name,
                        "logoUrl":x.logoURL,
                        "streetAddress":x.street,
                        "city":x.city,
                        "state":x.state,
                        "zip":x.zip,
                        "apiKey":x.apiMenuKey
                    });
                };
                res.render('restaurant',{title:'Restaurants', result:jres});

            });
        } else{
            if (req.body.search == '') {
                res.render('redirect', {type: 'recipe', label: req.body.label})
            }else {
                //console.log("haha3")
                var INPUT = req.body.search
                if (req.body.label != null) {
                    console.log(req.body.label);
                    req.body.search = req.body.search + '&search=' + req.body.label
                }
                request('https://api.eatstreet.com/publicapi/v1/restaurant/search?method=both&street-address=' + req.body.search + '&access-token=' + token3, function (error, response, body){
                    if (error) throw new Error(error);
                    var Res = JSON.parse(body).restaurants;
                    for (var i = 0; i < Res.length; i++){
                        const new_res = new Restaurants({term:INPUT, apiMenuKey:Res[i].apiKey, name:Res[i].name, street:Res[i].streetAddress,
                            city:Res[i].city, state:Res[i].state, zip:Res[i].zip, logoURL:Res[i].logoUrl, PhoneNum:Res[i].phone});
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

router.post('/menu', function(req, res) {

    var resKey = req.body.id;
/*
    Menus.count({resKey: resKey},function(err, result) {

        if (result != 0) {
            Menus.find({resKey: resKey}, function (err, result) {
                var menus = {hits: []};
                var name1 = {items: []};
                console.log(result[0].name);
                for (var i in result) {
                    //console.log(result[i].name)
                    for (var j in result[i].name)
                        //console.log(result[i].name[j]);
                        var item = result[i].name[j];
                        name1.items.push({
                            "name": item,
                            "nothing":"hi"
                    });
                }
                //console.log(name1.items);
                for (var j in result) {
                    var item2 = result[j];

                    menus.hits.push({
                        "name": item2.category,
                        "items": name1.items

                    });
                }
                //console.log(menus.hits);
                res.render('menu', {result: menus.hits});

            });
        }

        else {*/
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
        //}
    //})
});

router.post('/main', function(req, res) {
    res.render('main');
});

router.get('/main', function(req, res) {
    res.render('main');
});

module.exports = router;
