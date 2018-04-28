var mongoose = require('mongoose');
if (!mongoose.connection.db){
    mongoose.connect('mongodb://localhost/CS411');
}

var db = mongoose.connection;
var Schema = mongoose.Schema;
var menus = new Schema({
    category: String,
    name:[String]

})

var Menus = mongoose.model('Menus', menus);

module.exports = Menus;