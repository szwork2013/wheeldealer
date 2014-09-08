/* ---------------------------------------------- */
/*             USER REGISTRATION                  */
/*------------------------------------------------*/

exports.appUserRegister = function(db) {
 return function(req, res){
     var appLanguageCol = db.get('app_text_language');

     var language = 'en_US';   

     if (req.params.lang == null)
       language = 'en_US'
     else
        language = req.params.lang
   
   appLanguageCol.find({"language" : language},function(e,appMenuLangDocs){  
    res.render('userlogin/login-register', { 
      user : req.user,
      'appMenuLangVar'  : appMenuLangDocs,       
      'langVar' : language  
    });
   });
 }
}

exports.appUserRegisterPost = function(db,AccountUser,passportUser,mailer) {
 return function(req, res) {
     var appLanguageCol = db.get('app_text_language');
     var language = 'en_US';   

    if (req.params.lang == null)
       language = 'en_US'
    else
       language = req.params.lang

    var jsonContact = {}; 

    jsonContact['con_Name']    = '';
    jsonContact['con_Email']   = req.body.username;
    jsonContact['con_Street']  = '';
    jsonContact['con_Zip']     = '';
    jsonContact['con_City']    = '';
    jsonContact['con_Country'] = '';
    jsonContact['con_Phone1']  = '';
    jsonContact['con_Phone2']  = '';
    jsonContact['con_Mobile1'] = '';
    jsonContact['con_Mobile2'] = '';

    var jsonFavorites = {};

    jsonFavorites['fav_car'] = [];
    jsonFavorites['fav_motor'] = [];
    jsonFavorites['fav_partcar'] = [];
    jsonFavorites['fav_partmotor'] = [];
    jsonFavorites['fav_service'] = [];
    jsonFavorites['fav_dealer'] = [];
   

    var newPassword = Math.random().toString(36).slice(2);  

    appLanguageCol.find({"language" : language},function(e,appMenuLangDocs){  
      AccountUser.register(new AccountUser({ 
           username      : req.body.username,
           contactInfo   : jsonContact,
           favoritesInfo : jsonFavorites
        }), newPassword, function(error, account) {
        if (error) {
          console.log(error);
          return res.render("userlogin/login-register", {'errorVar'         : appMenuLangDocs[0].error_001,
                                                         'appMenuLangVar'   : appMenuLangDocs, 
                                                         'langVar'          : language});
        } else {             
                mailer.send('email/email-user-create', {
                   to          : req.body.username, 
                   subject     : appMenuLangDocs[0].email_useradd_subject,
                   userVar     : req.body.username,
                   passwordVar : newPassword,
                   langVar     : language,
                   appMenuLangVar: appMenuLangDocs
                   }, function (error) {
                      if (error) {
                        console.log(error);
                        res.render("userlogin/login-register", {'appMenuLangVar'  : appMenuLangDocs, 
                                                                'langVar'         : language,
                                                                'errorVar'        : appMenuLangDocs[0].error_003});
                   
                    } else {
                      res.render("userlogin/login-register", {'appMenuLangVar'  : appMenuLangDocs, 
                                                              'langVar'         : language,
                                                              'infoVar'         : appMenuLangDocs[0].info_001});
                    }
              });
        } 
     });
   });
  }
}

/* ---------------------------------------------- */
/*                  USER LOGIN                    */
/*------------------------------------------------*/

exports.appUserLogin = function(db) {
 return function(req, res){
     var appLanguageCol = db.get('app_text_language');

     var language = 'en_US';   

     if (req.params.lang == null)
       language = 'en_US'
     else
        language = req.params.lang
   
   appLanguageCol.find({"language" : language},function(e,appMenuLangDocs){  
    res.render('userlogin/login', { 
      user : req.user,
      'appMenuLangVar'  : appMenuLangDocs,       
      'langVar'         : language,
      'itemIdVar'       : req.query.item
    });
   });
 }
}

exports.appUserLoginPost = function(db,passportUser) {
 return function loginPost(req, res, next) {
     var appLanguageCol = db.get('app_text_language');
     var language = 'en_US';   

     if (req.params.lang == null)
       language = 'en_US'
     else
        language = req.params.lang

    // ask passport to authenticate
     passportUser.authenticate('local', function(error, user, info) {
     if (error) {
       // if error happens
       return next(error);
     }
    
    if (!user) {
      appLanguageCol.find({"language" : language},function(e,appMenuLangDocs){
        return res.render("userlogin/login", {'errorVar'        : appMenuLangDocs[0].error_002,
                                              'appMenuLangVar'  : appMenuLangDocs, 
                                              'langVar'         : language});
       });
    } else {
      // if everything's OK
     req.logIn(user, function(error) {
       if (error) {
        appLanguageCol.find({"language" : language},function(e,appMenuLangDocs){
           return res.render("userlogin/login", {'errorVar'        : appMenuLangDocs[0].error_002,
                                              'appMenuLangVar'  : appMenuLangDocs, 
                                              'langVar'         : language});
        });
       } else {
         appLanguageCol.find({"language" : language},function(e,appMenuLangDocs){
            return res.redirect('/'+language+'/');
         });
       }
    });
    }    
  })(req, res, next);
 }
}

/* ---------------------------------------------- */
/*                 USER LOGOUT                    */
/*------------------------------------------------*/

exports.appUserLogout = function(db) {
 return function(req, res){
     req.logout();
      var language = 'en_US';   

     if (req.params.lang == null)
       language = 'en_US'
     else
        language = req.params.lang

      res.redirect('/'+language +'/');
 }
}

/* ---------------------------------------------- */
/*             USER PASSWORD SEND                 */
/*------------------------------------------------*/

exports.appUserPasswordSend = function(db) {
 return function(req, res){
     var appLanguageCol = db.get('app_text_language');

     var language = 'en_US';   

     if (req.params.lang == null)
       language = 'en_US'
     else
        language = req.params.lang

      appLanguageCol.find({"language" : language},function(e,appMenuLangDocs){
        return res.render("userlogin/login-password-send", {'appMenuLangVar'  : appMenuLangDocs, 
                                                            'langVar'         : language});
      });
  }
}


exports.appUserPasswordSendPost = function(db,Account,passport,mailer) {
 return function(req, res){
                
     var appLanguageCol = db.get('app_text_language');
     var userCol = db.get('accountusers');
     var language = 'en_US';   

     if (req.params.lang == null)
       language = 'en_US'
     else
        language = req.params.lang

     userCol.find({username : req.body.con_Email},function(e,userDocs){
       
       var newPassword = Math.random().toString(36).slice(2);
       if(userDocs.length == 0) {
           appLanguageCol.find({"language" : language},function(e,appMenuLangDocs){
             res.render("userlogin/login-password-send", {'appMenuLangVar'  : appMenuLangDocs, 
                                                          'langVar'         : language,
                                                          'errorVar'        : appMenuLangDocs[0].error_005});
           });
       }       
       else {

         Account.findOne({
          _id: userDocs[0]._id
          }, function (error, doc) {     
                doc.setPassword(newPassword,function(error) {
                  if (!error) {
                        doc.save(function(error){
                            if (error) {
                                 res.render("userlogin/login-password", {'appMenuLangVar'  : appMenuLangDocs, 
                                                                         'langVar'         : language,
                                                                         'errorVar'        : appMenuLangDocs[0].error_003});
                            }
                            else {
                                  appLanguageCol.find({"language" : language},function(e,appMenuLangDocs){
                                    mailer.send('email/email-contact-user', {
                                      to             : req.body.con_Email, 
                                      subject        : appMenuLangDocs[0].email_user_password_subject,
                                      userVar        : userDocs[0].username,
                                      passwordVar    : newPassword,
                                      appMenuLangVar : appMenuLangDocs
                                    },function(error,mailDocs){ 
                                      if (!error) {
                                        res.render("userlogin/login-password-send", {'appMenuLangVar'  : appMenuLangDocs, 
                                                                                      'langVar'        : language,
                                                                                      'infoVar'        : appMenuLangDocs[0].info_003});
                                      }
                                      else {
                                         res.render("userlogin/login-password-send", {'appMenuLangVar'  : appMenuLangDocs, 
                                                                                      'langVar'         : language,
                                                                                      'errorVar'        : appMenuLangDocs[0].error_003});
                                      }
                                    });
                                   
                                 })
                            }
                    });     
                  }
                });
          }
        );
      }       
     });
 }
}

/* ---------------------------------------------- */
/*             USER PASSWORD CHANGE               */
/*------------------------------------------------*/

exports.appUserPasswordChange = function(db) {
    return function(req,res){
     var appLanguageCol = db.get('app_text_language');

     var language = 'en_US';   

     if (req.params.lang == null)
       language = 'en_US'
     else
        language = req.params.lang

      appLanguageCol.find({"language" : language},function(e,appMenuLangDocs){
        return res.render("userlogin/login-password-change", {'appMenuLangVar'  : appMenuLangDocs, 
                                                              'langVar'         : language});
      });

    }
}

exports.appUserPasswordChangePost = function(db,Account,passport,mailer) {
  return function loginPost(req, res, next) {
     var appLanguageCol = db.get('app_text_language');
     var userCol = db.get('accountusers');
     var language = 'en_US';   

     if (req.params.lang == null)
       language = 'en_US'
     else
        language = req.params.lang

     appLanguageCol.find({"language" : language},function(e,appMenuLangDocs){     
         passport.authenticate('local', function(error, user, info) {
            if (error) {
                res.render("userlogin/login-password-send", {'appMenuLangVar'  : appMenuLangDocs, 
                                                             'langVar'         : language,
                                                             'errorVar'        : appMenuLangDocs[0].error_002});               
                return next(error);             
            } else {
                req.logIn(user, function(error) {
                   if (error) {
                      res.render("userlogin/login-password-send", {'appMenuLangVar'  : appMenuLangDocs, 
                                                                   'langVar'         : language,
                                                                   'errorVar'        : appMenuLangDocs[0].error_002});
                    return next(error);
                   } else {
                      Account.findOne({
                          username: req.body.username
                          }, function (error, doc) {
                              doc.setPassword(req.body.newpassword,function(error) {
                                 if (!error) {
                                    doc.save(function(error){
                                       if (error) {
                                           res.render("userlogin/login-password-send", {'appMenuLangVar'  : appMenuLangDocs, 
                                                                                        'langVar'         : language,
                                                                                        'errorVar'        : appMenuLangDocs[0].error_004});
                                        } 
                                        else {
                                           res.render("userlogin/login", {'appMenuLangVar'  : appMenuLangDocs, 
                                                                          'langVar'         : language,
                                                                          'infoVar'         : appMenuLangDocs[0].info_002});
                                        }
                                   });
                                 }
                                 else {
                                    console.log(error)
                                    res.render("userlogin/login-password-send", {'appMenuLangVar'  : appMenuLangDocs, 
                                                                                 'langVar'         : language,
                                                                                 'errorVar'         : appMenuLangDocs[0].error_004});
 
                                 }
                             });
                          });
                    }
                 });
			}
        })(req, res, next);
     });    
  }
}
