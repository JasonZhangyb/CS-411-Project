var mongoose = require('mongoose');
if (!mongoose.connection.db){
    mongoose.connect('mongodb://localhost/CS411');
}

var db = mongoose.connection;
var Schema = mongoose.Schema;

var restaurants = new Schema({
    term: String,
    apiMenuKey: String,
    name: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    logoURL: String,
    PhoneNum: String
})

var Restaurants = mongoose.model('Restaurants', restaurants);

module.exports = Restaurants;