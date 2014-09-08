
/**
 * Module dependencies.
 */

var flash = require('connect-flash');
var express = require('express');
var mailer = require('express-mailer');
var routes = require('./routes/index.js');
var viewcar = require('./routes/viewCar.js');
var viewmotor = require('./routes/viewMotor.js');
var viewpartcar = require('./routes/viewPartcar.js');
var viewpartmotor = require('./routes/viewPartmotor.js');
var viewservice = require('./routes/viewService.js');
var viewdealer = require('./routes/viewDealer.js');
var userlogin = require('./routes/userlogin.js');
var userpanel = require('./routes/userpanel.js');
var adminlogin = require('./routes/adminlogin.js');
var adminpanel = require('./routes/adminpanel.js');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var passportUser = require('passport');
var passportAdmin = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/appmoto');
var fs = require('fs');
var mv = require('mv');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(flash());
app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(express.json());
app.use(express.multipart());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(passportUser.initialize());
app.use(passportAdmin.initialize());
app.use(passportUser.session({cookie: { path: '/', httpOnly: true, maxAge: null}, secret:'eeuqram'}));
app.use(passportAdmin.session({cookie: { path: '/', httpOnly: true, maxAge: null}, secret:'eeuqram'}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

mailer.extend(app, {
  from: 'mailinfo@wheeldealer.ca',
  host: 'mail.wheeldealer.ca', // hostname
  secureConnection: false, // use SSL
  port: 25, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: 'mailinfo@wheeldealer.ca',
    pass: 'Cr8zyDB8'
  }
});

// passport config user
var AccountUser = require('./models/accountUser');
passportUser.use(new LocalStrategy(AccountUser.authenticate()));
passportUser.serializeUser(AccountUser.serializeUser());
passportUser.deserializeUser(AccountUser.deserializeUser());

// passport config admin
var AccountAdmin = require('./models/accountAdmin');
passportAdmin.use(new LocalStrategy(AccountUser.authenticate()));
passportAdmin.serializeUser(AccountUser.serializeUser());
passportAdmin.deserializeUser(AccountUser.deserializeUser());


// mongoose
mongoose.connect('mongodb://localhost/appmoto');

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/:lang/', routes.index(db));
app.get('/', routes.index(db));
//app.get('/mail-mail/dummy', routes.mail(app.mailer));

//////
app.get('/index-contact/:lang',routes.appContactUs(db));
app.post('/index-contact/:lang',routes.appContactUsPost(db,app.mailer));
app.get('/index-advertise/:lang',routes.appAdvertiseWithUs(db));

//////Car
app.get('/index-car/:lang/:traPerPage/:sort/:searchView/:page/:menuLevel/:catLevel1/:catLevel2/:catLevel3/:body/:transmition/:color/:fuel/:minYear/:maxYear/:minEngine/:maxEngine/:minMileage/:maxMileage/:minPrize/:maxPrize/:city/:country', viewcar.appProductList(db));
app.get('/product-item-car/:lang/:traPerPage/:sort/:id/:searchView/:page/:menuLevel/:catLevel1/:catLevel2/:catLevel3/:body/:transmition/:color/:fuel/:minYear/:maxYear/:minEngine/:maxEngine/:minMileage/:maxMileage/:minPrize/:maxPrize/:city/:country', viewcar.appProductItem(db));

//////Motor
app.get('/index-motor/:lang/:traPerPage/:sort/:searchView/:page/:menuLevel/:catLevel1/:catLevel2/:catLevel3/:body/:transmition/:color/:fuel/:minYear/:maxYear/:minEngine/:maxEngine/:minMileage/:maxMileage/:minPrize/:maxPrize/:city/:country', viewmotor.appProductList(db));
app.get('/product-item-motor/:lang/:traPerPage/:sort/:id/:searchView/:page/:menuLevel/:catLevel1/:catLevel2/:catLevel3/:body/:transmition/:color/:fuel/:minYear/:maxYear/:minEngine/:maxEngine/:minMileage/:maxMileage/:minPrize/:maxPrize/:city/:country', viewmotor.appProductItem(db));

/////Service
app.get('/index-service/:lang/:traPerPage/:sort/:searchView/:page/:menuLevel/:catLevel1/:catLevel2/:catLevel3', viewservice.appProductList(db));
app.get('/product-item-service/:lang/:traPerPage/:sort/:id/:searchView', viewservice.appProductItem(db));

/////Dealer
app.get('/index-dealer/:lang/:traPerPage/:sort/:searchView/:page/:menuLevel/:catLevel1/:catLevel2/:catLevel3', viewdealer.appProductList(db));
app.get('/product-item-dealer/:lang/:traPerPage/:sort/:id/:searchView', viewdealer.appProductItem(db));

////CarPart
app.get('/index-partcar/:lang/:traPerPage/:sort/:searchView/:page/:menuLevel/:catLevel1/:catLevel2', viewpartcar.appProductList(db));
app.get('/product-item-partcar/:lang/:traPerPage/:sort/:id/:searchView', viewpartcar.appProductItem(db));
////PartMotor
app.get('/index-partmotor/:lang/:traPerPage/:sort/:searchView/:page/:menuLevel/:catLevel1/:catLevel2', viewpartmotor.appProductList(db));
app.get('/product-item-partmotor/:lang/:traPerPage/:sort/:id/:searchView', viewpartmotor.appProductItem(db));

////Contact 
app.post('/contact-user/:lang', userpanel.appUserContact(db, app.mailer));

/////User panel
app.get('/userpanel/:lang', userpanel.appUserPanel(db));

app.get('/userpanel-product-add/:lang/:category/:menuLevel/:catLevel1/:catLevel2/:catLevel3/:dummy', userpanel.appProductAdd(db));
app.get('/userpanel-product-item/:lang/:category/:id',userpanel.appUserProductItem(db));
app.get('/userpanel-product-add-confirm/:lang/:category/:id', userpanel.appUserProductAddConfirm(db,app.mailer));
app.get('/userpanel-product-edit/:lang/:category/:id', userpanel.appProductEdit(db));

app.get('/userpanel-product-list-my/:lang/:category', userpanel.appUserPanelProductListMy(db));
app.get('/userpanel-product-list-fav/:lang/:category', userpanel.appUserProductListFav(db));

app.get('/userpanel-contactinfo-view/:lang',userpanel.appUserContactInfoView(db));

app.post('/userpanel-product-add-submit/:lang/:category',  userpanel.appUserProductAddSubmit(db,fs,mv));   
app.post('/userpanel-product-add-submit-service/:lang/:category',  userpanel.appUserProductAddSubmitService(db,fs,mv));
app.post('/userpanel-product-add-submit-part/:lang/:category',  userpanel.appUserProductAddSubmitPart(db,fs,mv));
app.post('/userpanel-product-edit-submit/:lang/:category/:id',  userpanel.appUserProductEditSubmit(db,fs,mv));
app.post('/userpanel-product-remove/:lang/:category',userpanel.appUserProductRemove(db,fs));

app.post('/userpanel-product-item-fav',userpanel.appUserProductItemFav(db));    
app.post('/userpanel-contactinfo-update/:lang',userpanel.appUserContactInfoUpdate(db));
app.post('/userpanel-paypal-reps/:lang',userpanel.appUserProductAddPayPalPost(db));

/////User LogIn - Registration
app.get('/login/:lang', userlogin.appUserLogin(db));
app.get('/logout/:lang', userlogin.appUserLogout(db));
app.get('/register/:lang', userlogin.appUserRegister(db));
app.get('/password-send/:lang/',userlogin.appUserPasswordSend(db));
app.get('/password-change/:lang/',userlogin.appUserPasswordChange(db));

app.post('/login/:lang/',userlogin.appUserLoginPost(db,passportUser));
app.post('/register-post/:lang/',userlogin.appUserRegisterPost(db,AccountUser,passportUser,app.mailer));
app.post('/password-send-post/:lang/',userlogin.appUserPasswordSendPost(db,AccountUser,passportUser,app.mailer));
app.post('/password-change-post/:lang/',userlogin.appUserPasswordChangePost(db,AccountUser,passportUser,app.mailer));
//

/////Admin panel
app.get('/cmclogin/admin', adminlogin.appAdminLogin(db));
app.get('/cmcpanel/admin', adminpanel.appAdminPanel(db));
app.get('/adminpanel-menu-add-car/:menuLevel/:car/:model/:typ',adminpanel.appAdminPanelMenuAddCar(db));

app.post('/adminpanel-menu-add-catlevel1/:category', adminpanel.appAdminMenuAddCar(db));  
app.post('/adminpanel-menu-add-catlevel2/:category', adminpanel.appAdminMenuAddCarModel(db));  
app.post('/adminpanel-menu-add-catlevel3/:category', adminpanel.appAdminMenuAddCarTyp(db));  

app.post('/cmclogin', passportAdmin.authenticate('local'), function(req, res) {
         res.redirect('/cmcpanel/admin');
 });

app.post('/search/:lang', viewcar.appProductSearch());

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
