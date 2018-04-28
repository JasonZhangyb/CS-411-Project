var mongoose = require('mongoose');
if (!mongoose.connection.db){
    mongoose.connect('mongodb://localhost/CS411');
}

var db = mongoose.connection;
var Schema = mongoose.Schema;
var users = new Schema({
    userID: String,
    username: String,
})


var User = mongoose.model('User', users);

module.exports = User;