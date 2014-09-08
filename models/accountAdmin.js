var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var AccountAdmin = new Schema({
    username: String,
    email: String,
    firstName: String,
    lastName: String,
    group: String
});

AccountAdmin.plugin(passportLocalMongoose);

module.exports = mongoose.model('AccountAdmin', AccountAdmin);
