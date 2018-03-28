var express = require('express');
var router = express.Router();
var request = require("request");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
    const options = {
        method: 'GET',
        url: 'https://api.edamam.com/search?q=chicken&app_id=$669e0214&app_key=$716aa8a8333325e8c02aa1e252bd6732',
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
        res.render('index', {title: 'Recipes', result: JSON.parse(body)});
    });

});

module.exports = router;
