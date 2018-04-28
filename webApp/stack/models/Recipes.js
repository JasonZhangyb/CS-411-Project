var mongoose = require('mongoose');
if (!mongoose.connection.db){
    mongoose.connect('mongodb://localhost/CS411');
}

var db = mongoose.connection;
var Schema = mongoose.Schema;

var recipes = new Schema({
    term: String,
    label: String,
    image: String,
    recipe_url: String,
    yield: Number,
    calories: Number,
    ingredients: [String]
})

var Recipes = mongoose.model('Recipes', recipes);

module.exports = Recipes;