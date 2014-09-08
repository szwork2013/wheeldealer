var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var AccountUser = new Schema({
    username : String,
    contactInfo : { 
         con_Name    : String,
         con_Email   : String,
         con_Street  : String,
         con_Zip     : String,
         con_City    : String,
         con_Country : String,
         con_Phone1  : String,
         con_Phone2  : String,
         con_Mobile1 : String,
         con_Mobile2 : String
    },
    favoritesInfo : {
         fav_car : [],
         fav_truck : [],
         fav_motorcycle : [],
         fav_bike : []
    }
});

AccountUser.plugin(passportLocalMongoose);

module.exports = mongoose.model('AccountUser', AccountUser);
