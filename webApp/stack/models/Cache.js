var mongoose = require('mongoose');
if (!mongoose.connection.db){
    mongoose.connect('mongodb://localhost/CS411');
}

var db = mongoose.connection;
var Schema = mongoose.Schema;
var Recipes = new Schema({
    term: String,
    label: String,
    image: String,
    recipe_url: String,
    yield: Number,
    calories: Number,
    ingredients: [String]
})

var Restaurants = new Schema({
    apiMenuKey: String,
    name: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    logoURL: String,
    PhoneNO: String
})

var Menus = new Schema({
    category: String,
    name:[String]

})

var Recipes = mongoose.model('Recipes', Recipes, 'Cache');
var Restaurants = mongoose.model('Restaurants', Restaurants, 'Cache');
var Menus = mongoose.model('Menus', Menus, 'Cache');


module.exports = Cache;