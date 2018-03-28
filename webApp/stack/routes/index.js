var express = require('express');
var router = express.Router();
var request = require("request");

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Recipe Search <3' });
});

router.post('/recipe', function(req, res) {
    //const options = {
      //  method: 'GET',
        //url: 'http://food2fork.com/api/search?key=05368ae363c8bc64259aa4a4f2f66fb8&q=shredded%20chicken',
    //};
    console.log(req.body);
    console.log(req.body.search);
    request('http://food2fork.com/api/search?key=05368ae363c8bc64259aa4a4f2f66fb8&q=' + req.body.search, function (error, response, body){
    //request(options, function (error, response, body) {
        if (error) throw new Error(error);
        //res.send(' POST request!!');
        //console.log("Got here");
        console.log(response);
        res.render('recipe', {title: 'Recipes', result: JSON.parse(JSON.stringify(response))});
    });
    //res.send(' POST request to the homepage');
});

module.exports = router;
