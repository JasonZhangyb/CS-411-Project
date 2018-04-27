var express = require('express');
var router = express.Router();

router.get('/main', function(req, res) {
    //console.log(req.body);
    res.render('main', { title: 'Chefz' });
});

router.get('/', function(req, res) {
    res.render('index');
});

router.get('/restaurant', function(req, res) {

    res.render('restaurant', { title: 'Chefz2' });
});

module.exports = router;