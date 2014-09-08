exports.appUserPanel = function(db) {
  return function(req, res){
     var appLanguageCol = db.get('app_text_language');

     var language = 'en_US';   

     if (req.params.lang == null)
       language = 'en_US'
     else
       language = req.params.lang;   
     
     if (!req.user) {
      res.redirect('/login/'+req.params.lang)
     }
     else {
       appLanguageCol.find({"language" : language},function(e,appMenuLangDocs){  
         res.render('userpanel/userpanel', {
                               'user'            : req.user,
                               'appMenuLangVar'  : appMenuLangDocs, 
                               'langVar'         : language,
                               'menuViewVar'     : req.query.menu
         });
       });
     }
  }
}

exports.appUserProductItemFav = function(db) {
  return function(req, res){

   var language = 'en_US';   

   if (req.params.lang == null)
     language = 'en_US'
   else
       language = req.params.lang

   if (!req.user) {
      res.redirect('/login/'+req.params.lang)
   }
   else {
     var userCol   =  db.get('accountusers');
     var favorites = [];
     userCol.find({"username" : req.user.username},function(e,userDocs){
 
       if (req.body.category == 'car') {
            var update = true;
            favorites = userDocs[0].favoritesInfo.fav_car;
            for (var i = 0; i < userDocs[0].favoritesInfo.fav_car.length; i++) { 
               if (userDocs[0].favoritesInfo.fav_car[i] == req.body._id) 
                 update = false;
            }
            if(update == true) {
              favorites.push(req.body._id);
              userCol.update({'username' : req.user.username },{ $set: {'favoritesInfo.fav_car' : favorites} },function(e,favoritesDocs){
               res.redirect('back');
              });
            } else {
              res.redirect('back');
            }          
         }
	if (req.body.category == 'motor') {
            var update = true;
            favorites = userDocs[0].favoritesInfo.fav_motor;
            for (var i = 0; i < userDocs[0].favoritesInfo.fav_motor.length; i++) { 
               if (userDocs[0].favoritesInfo.fav_motor[i] == req.body._id) 
                 update = false;
            }
            if(update == true) {
              favorites.push(req.body._id);
              userCol.update({'username' : req.user.username },{ $set: {'favoritesInfo.fav_motor' : favorites} },function(e,favoritesDocs){
               res.redirect('back');
              });
            } else {
              res.redirect('back');
            }          
         }
	if (req.body.category == 'partcar') {
            var update = true;
            favorites = userDocs[0].favoritesInfo.fav_partcar;
            for (var i = 0; i < userDocs[0].favoritesInfo.fav_partcar.length; i++) { 
               if (userDocs[0].favoritesInfo.fav_partcar[i] == req.body._id) 
                 update = false;
            }
            if(update == true) {
              favorites.push(req.body._id);
              userCol.update({'username' : req.user.username },{ $set: {'favoritesInfo.fav_partcar' : favorites} },function(e,favoritesDocs){
               res.redirect('back');
              });
            } else {
              res.redirect('back');
            }          
         }
	if (req.body.category == 'partmotor') {
            var update = true;
            favorites = userDocs[0].favoritesInfo.fav_partmotor;
            for (var i = 0; i < userDocs[0].favoritesInfo.fav_partmotor.length; i++) { 
               if (userDocs[0].favoritesInfo.fav_partmotor[i] == req.body._id) 
                 update = false;
            }
            if(update == true) {
              favorites.push(req.body._id);
              userCol.update({'username' : req.user.username },{ $set: {'favoritesInfo.fav_partmotor' : favorites} },function(e,favoritesDocs){
               res.redirect('back');
              });
            } else {
              res.redirect('back');
            }          
         }
	if (req.body.category == 'service') {
            var update = true;
            favorites = userDocs[0].favoritesInfo.fav_service;
            for (var i = 0; i < userDocs[0].favoritesInfo.fav_service.length; i++) { 
               if (userDocs[0].favoritesInfo.fav_service[i] == req.body._id) 
                 update = false;
            }
            if(update == true) {
              favorites.push(req.body._id);
              userCol.update({'username' : req.user.username },{ $set: {'favoritesInfo.fav_service' : favorites} },function(e,favoritesDocs){
               res.redirect('back');
              });
            } else {
              res.redirect('back');
            }          
         }
	if (req.body.category == 'dealer') {
            var update = true;
            favorites = userDocs[0].favoritesInfo.fav_dealer;
            for (var i = 0; i < userDocs[0].favoritesInfo.fav_dealer.length; i++) { 
               if (userDocs[0].favoritesInfo.fav_dealer[i] == req.body._id) 
                 update = false;
            }
            if(update == true) {
              favorites.push(req.body._id);
              userCol.update({'username' : req.user.username },{ $set: {'favoritesInfo.fav_dealer' : favorites} },function(e,favoritesDocs){
               res.redirect('back');
              });
            } else {
              res.redirect('back');
            }          
         }
     });        
    }
  }
}

exports.appUserProductListFav  = function(db) {
  return function(req, res){
   //If user is not loggin refirect to login page
   if (!req.user) {
      res.redirect('/login/'+req.params.lang);
   }
   else {      
      if (validateCategory(req.params.category)) {
         var userCol   =  db.get('accountusers');
         var appLanguageCol = db.get('app_text_language');
         var productsCol = null;     

         productsCol   =  db.get('products_'+ req.params.category);     

         var favorites = [];
         var toAdd = true;
         userCol.find({"username" : req.user.username},function(e,userDocs){
           var query = {};
           query["$or"]=[];
           if (req.params.category == 'car') {
             for (var i = 0; i < userDocs[0].favoritesInfo.fav_car.length; i++) { 
               var jsonId = {};
               jsonId['_id'] = userDocs[0].favoritesInfo.fav_car[i];
               query["$or"].push(jsonId);
             }
           }
           if (req.params.category == 'motor') {
             for (var i = 0; i < userDocs[0].favoritesInfo.fav_motor.length; i++) { 
               var jsonId = {};
               jsonId['_id'] = userDocs[0].favoritesInfo.fav_motor[i];
               query["$or"].push(jsonId);
             }
           }
           if (req.params.category == 'partcar') {
             for (var i = 0; i < userDocs[0].favoritesInfo.fav_partcar.length; i++) { 
               var jsonId = {};
               jsonId['_id'] = userDocs[0].favoritesInfo.fav_partcar[i];
               query["$or"].push(jsonId);
             }
           }
           if (req.params.category == 'partmotor') {
             for (var i = 0; i < userDocs[0].favoritesInfo.fav_partmotor.length; i++) { 
               var jsonId = {};
               jsonId['_id'] = userDocs[0].favoritesInfo.fav_partmotor[i];
               query["$or"].push(jsonId);
             }
           }
           if (req.params.category == 'service') {
             for (var i = 0; i < userDocs[0].favoritesInfo.fav_service.length; i++) { 
               var jsonId = {};
               jsonId['_id'] = userDocs[0].favoritesInfo.fav_service[i];
               query["$or"].push(jsonId);
             }
           }
           if (req.params.category == 'dealer') {
             for (var i = 0; i < userDocs[0].favoritesInfo.fav_dealer.length; i++) { 
               var jsonId = {};
               jsonId['_id'] = userDocs[0].favoritesInfo.fav_dealer[i];
               query["$or"].push(jsonId);
             }
           }


           appLanguageCol.find({"language" : req.params.lang},function(e,appMenuLangDocs){ 
            productsCol.find(query,function(e,productsDocs) {
              if (!productsDocs) {
                 productsDocs = [];
              }
             res.render('userpanel/userpanel-product-list', {
                     'productsVar'     : productsDocs, 
                     'appMenuLangVar'  : appMenuLangDocs,  
                     'langVar'         : req.params.lang,
                     'user'            : req.user,
                     'categoryVar'     : req.params.category,
                     'menuViewVar'     : req.query.menu
             });
            });
           });
         });
      } else {
        console.log('ERROR - Invalid category: ' + req.params.category);
        res.render('error', {
                    messageVar : 'ERROR. Sorry. We do not have such category' + req.params.category       
        });
      }  
    }
 }
}

exports.appUserContactInfoView = function(db) {
  return function(req, res){
   //If user is not loggin refirect to login page
   if (!req.user) {
      res.redirect('/login/'+req.params.lang);
   }
   else {        
     var appLanguageCol = db.get('app_text_language');
     
     appLanguageCol.find({"language" : req.params.lang},function(e,appMenuLangDocs){
       res.render('userpanel/userpanel-contactinfo', {                                 
                    'appMenuLangVar'  : appMenuLangDocs, 
                    'user'            : req.user,
                    'langVar'         : req.params.lang,
                    'menuViewVar'     : req.query.menu
        });
     });
   }
  }
}

exports.appUserContactInfoUpdate = function(db) {
  return function(req, res){
   //If user is not loggin refirect to login page
   if (!req.user) {
      res.redirect('/login/'+req.params.lang);
   }
   else {        
     var userCol = db.get('accountusers');
     var jsonContact = {};
     var bodyKeys = Object.keys(req.body);

      bodyKeys.forEach(function(key) {
         var keyPrefix = key.substring(0,4);
         if (keyPrefix == 'con_')
             jsonContact[key] = req.body[key];
      });
   
     userCol.update({'username' : req.user.username },{ $set: {'contactInfo' : jsonContact} },function(e,modelDocs){
        res.redirect('/userpanel/'+req.params.lang+'?menu='+req.query.menu);
     }); 
    }         
  }
}

exports.appUserProductRemove  = function(db,fs) {
  return function(req, res){
    //If user is not loggin refirect to login page
    if (!req.user) {
      res.redirect('/login/'+req.params.lang);
    }
    else { 
     if (validateCategory(req.params.category)) {    
       var catLevel1Col = db.get('app_text_' + req.params.category + '_level1');
       var catLevel2Col = db.get('app_text_' + req.params.category + '_level2');
       var catLevel3Col = db.get('app_text_' + req.params.category + '_level3');

       var productsCol = db.get('products_'+req.params.category);
       var dateDeleted = new Date();
       productsCol.update({'_id' : req.body._id, 'advertisementInfo.adv_Username' : req.user.username },{ $set: {'advertisementInfo.adv_Status' : 'deleted','advertisementInfo.adv_DateDeleted' : dateDeleted} },function(error,modelDocs){
         var sourceFile = './public/images/' + req.body._id;
         var destFile   = './public/images/deleted/' + req.body._id;

         fs.rename(sourceFile, destFile, function(error) {
            if (error) throw error;
                fs.unlink(sourceFile, function() {
                if (error)
                    console.log(error);
                else
                    console.log('File moved from: ' + sourceFile + ' to ' + destFile);
                });
          });

         if (error) {
              console.log('ERROR - Database ERROR: ' + error);
              res.render('error', {
                  messageVar : 'ERROR. While confirming the advertisement with id ' + req.params.id 
             });            
         } else  {
            productsCol.find({'_id' : req.body._id },function(error,productDocs){
              if(productDocs[0].categoryInfo.cat_Level1 != '' && productDocs[0].categoryInfo.cat_Level1 != null) {
                catLevel1Col.update({'cat_Level1' : productDocs[0].categoryInfo.cat_Level1 },{ $inc: {'cat_Count' : -1}},function(error,catLevel1Docs){
                  if(error) 
                    console.log(error);
                });
              }
              if(productDocs[0].categoryInfo.cat_Level2 != '' && productDocs[0].categoryInfo.cat_Level2 != null) {
                catLevel2Col.update({'cat_Level1' : productDocs[0].categoryInfo.cat_Level1,'cat_Level2' : productDocs[0].categoryInfo.cat_Level2},{ $inc: {'cat_Count' : -1}},function(error,catLevel2Docs){
                  if(error) 
                    console.log(error);
                });
               }
              if(productDocs[0].categoryInfo.cat_Level3 != '' && productDocs[0].categoryInfo.cat_Level3 != null) {
                catLevel3Col.update({'cat_Level1' : productDocs[0].categoryInfo.cat_Level1,'cat_Level2' : productDocs[0].categoryInfo.cat_Level2,'cat_Level3' : productDocs[0].categoryInfo.cat_Level3},{ $inc: {'cat_Count' : -1}},function(error,catLevel3Docs){
                  if(error) 
                    console.log(error);
                });
              }
           });
          } 
        res.redirect('/userpanel-product-list-my/'+req.params.lang + '/' + req.params.category + '?menu='+req.query.menu);
       });
    }
    else {
       console.log('ERROR - Invalid category: ' + req.params.category);
       res.render('error', {
                   messageVar : 'ERROR. Sorry. We do not have such category' + req.params.category       
       });
    }
   }
  }
 }

exports.appProductEdit  = function(db) {
  return function(req, res){
    //If user is not loggin refirect to login page
    if (!req.user) {
      res.redirect('/login/'+req.params.lang);
    }
    else { 
     if (validateCategory(req.params.category)) {   
       var productsCol = db.get('products_'+req.params.category);
       var appLanguageCol = db.get('app_text_language');
     
       appLanguageCol.find({"language" : req.params.lang},function(e,appMenuLangDocs){  
         productsCol.find({'_id' : req.params.id},function(e,productsDocs){       
           res.render('userpanel/userpanel-product-edit-'+req.params.category, {                                 
                                 'appMenuLangVar'  : appMenuLangDocs, 
                                 'productsVar'     : productsDocs,  
                                 'stepLevelVar'    : 1, 
                                 'user'            : req.user,
                                 'langVar'         : req.params.lang,
                                 'menuViewVar'     : req.query.menu
            });
         });
       });
      }  
      else {
       console.log('ERROR - Invalid category: ' + req.params.category);
       res.render('error', {
                   messageVar : 'ERROR. Sorry. We do not have such category' + req.params.category       
       });
      }
    } 
  }
 }

exports.appUserProductEditSubmit = function(db,fs,mv) {
  return function(req, res){
    //If user is not loggin refirect to login page
    if (!req.user) {
      res.redirect('/login/'+req.params.lang);
    }
    else { 
     if (validateCategory(req.params.category)) {   
        var productsCol = db.get('products_'+req.params.category);      
        productsCol.find({'_id' : req.body._id},function(e,productsDocs){

        var pathImg  = '/images/products_' + req.params.category + '/' + req.body._id + '/';
        var pathDest = './public/images/products_' + req.params.category + '/' + req.body._id + '/';

        var files = [];

        var filesKey  = Object.keys(req.body);

        var bodyKeys = Object.keys(req.body);
        var jsonDetails = {};
        var jsonDescription = {};
        var jsonContact = {};
        var optionsSafety  = [];
        var optionsComfort = [];

        bodyKeys.forEach(function(key) {
         var keyPrefix = key.substring(0,4);
         if (keyPrefix == 'det_') {
           console.log(key);
           if (key == 'det_Prize') {
             console.log('Prize');
             jsonDetails[key] = parseFloat(req.body[key]);            
	   } else {
              jsonDetails[key] = req.body[key];
           }
         }
         if (keyPrefix == 'opt_') {
            if (key.substring(4,5) == 's') {
                optionsSafety.push(key.substring(6,key.length))
            }
            if (key.substring(4,5) == 'c') {
               optionsComfort.push(key.substring(6,key.length))
            }
         }
         if (keyPrefix == 'des_')
            jsonDescription[key] = req.body[key];
         if (keyPrefix == 'con_')
            jsonContact[key] = req.body[key];           
         if (keyPrefix == 'ind_') {
            if (req.body[key] == 'current') {
               files.push(productsDocs[0].imagesAray[parseInt(key.substring(key.length-1,key.length))-1]);
            }
            if (req.body[key] == 'new') {
               var filePath = req.files[key.substring(4,key.length)].path;
               var fileName = filePath.substring(5,filePath.length);
               files.push(pathImg + fileName);
               mv(req.files[key.substring(4,key.length)].path, pathDest + fileName, function(err) {
                 if (err) throw err; 
               });                          
            }       
         }
        });

       productsCol.update({'_id' : req.body._id },{ $set : {'detailsInfo'         : jsonDetails,
                                                            'contactInfo'         : jsonContact, 
                                                            'descriptionInfo'     : jsonDescription,
                                                            'optionsSafetyArray'  : optionsSafety,
                                                            'optionsComfortArray' : optionsComfort,
                                                            'imagesAray'          : files}},
          function(e,modelDocs){
            res.redirect('/userpanel/'+req.params.lang+'?menu='+req.query.menu);
          }); 
      });
    }
    else {
       console.log('ERROR - Invalid category: ' + req.params.category);
       res.render('error', {
                   messageVar : 'ERROR. Sorry. We do not have such category' + req.params.category       
       });
    }
   }
 }
}

exports.appProductAdd = function(db) {

 return function(req, res){
  //If user is not loggin refirect to login page
   if (!req.user) {
      res.redirect('/login/'+req.params.lang);
   }
   else { 
     if (validateCategory(req.params.category)) {
        
        var catLevel1Col = null;
        var catLevel2Col = null;
        var catLevel3Col = null;
 
        if (req.params.category == 'dealer' ) {
          catLevel1Col = db.get('app_text_service_level1');
          catLevel2Col = db.get('app_text_service_level2');
          catLevel3Col = db.get('app_text_service_level3');
        } else {
          catLevel1Col = db.get('app_text_' + req.params.category + '_level1');
          catLevel2Col = db.get('app_text_' + req.params.category + '_level2');
          catLevel3Col = db.get('app_text_' + req.params.category + '_level3');          
        }

        var appLanguageCol = db.get('app_text_language');

        var language = 'en_US';   

        if (req.params.lang == null)
          language = 'en_US'
        else
          language = req.params.lang;   
  
        appLanguageCol.find({"language" : language},function(error,appMenuLangDocs){ 
          catLevel1Col.find({$query:{},$orderby :{cat_Level1 :1}},function(e,catLevel1Docs){         
            if (req.params.menuLevel == 0) {
              res.render('userpanel/userpanel-product-add-'+req.params.category, {
                                           'catLevel1Var' : catLevel1Docs, 
                                           'menuLevelVar' : req.params.menuLevel,
                                           'appMenuLangVar'  : appMenuLangDocs, 
                                           'user' : req.user, 
                                           'stepLevelVar': 1,
                                           'langVar' : language,
                                           'menuViewVar'     : req.query.menu});
            }
            if (req.params.menuLevel == 1) {
               catLevel2Col.find({$query:{'cat_Level1' : req.params.catLevel1 },$orderby:{cat_Level2 :1}},function(e,catLevel2Docs){ 
                 res.render('userpanel/userpanel-product-add-'+req.params.category, {
                                            'catLevel1Var' : catLevel1Docs, 
                                            'catLevel2Var' : catLevel2Docs,
                                            'menuLevelVar' : req.params.menuLevel,
                                            'appMenuLangVar'  : appMenuLangDocs, 
                                            'catLevel1LabelVar' : req.params.catLevel1,
                                            'user' : req.user, 
                                            'stepLevelVar': 1,
                                            'langVar' : language,
                                            'menuViewVar'     : req.query.menu});
               });
            }
            if (req.params.menuLevel == 2) {
               catLevel2Col.find({$query:{'cat_Level1' : req.params.catLevel1 },$query:{cat_Level2:1}},function(e,catLevel2Docs){ 
                 catLevel3Col.find({$query:{'cat_Level1' : req.params.catLevel1, 'cat_Level2' : req.params.catLevel2},$orderby:{cat_Level3:1}},function(e,catLevel3Docs){ 
                   res.render('userpanel/userpanel-product-add-'+req.params.category, {
                                             'catLevel1Var' : catLevel1Docs, 
                                             'catLevel2Var' : catLevel2Docs, 
                                             'catLevel3Var' : catLevel3Docs, 
                                             'menuLevelVar' : req.params.menuLevel, 
                                             'appMenuLangVar'  : appMenuLangDocs,
                                             'catLevel1LabelVar' : req.params.catLevel1,
                                             'catLevel2LabelVar' : req.params.catLevel2, 
                                             'user' : req.user, 
                                             'stepLevelVar': 1 ,
                                             'langVar' : language,
                                             'menuViewVar'     : req.query.menu});
                 });
              });
            }
            if (req.params.menuLevel == 3) {
               catLevel2Col.find({$query:{'cat_Level1' : req.params.catLevel1 },$query:{cat_Level2:1}},function(e,catLevel2Docs){ 
                  catLevel3Col.find({$query:{'cat_Level1' : req.params.catLevel1, 'cat_Level2' : req.params.catLevel2},$orderby:{cat_Level3:1}},function(e,catLevel3Docs){ 
                    res.render('userpanel/userpanel-product-add-'+req.params.category, {
                                              'catLevel1Var' : catLevel1Docs, 
                                              'catLevel2Var' : catLevel2Docs, 
                                              'catLevel3Var' : catLevel3Docs, 
                                              'menuLevelVar' : req.params.menuLevel, 
                                              'appMenuLangVar'  : appMenuLangDocs,
                                              'catLevel1LabelVar' : req.params.catLevel1,
                                              'catLevel2LabelVar' : req.params.catLevel2, 
                                              'catLevel3LabelVar' : req.params.catLevel3, 
                                              'user' : req.user, 
                                              'stepLevelVar': 1,
                                              'langVar' : language,
                                              'menuViewVar'     : req.query.menu });
                 });
              });
             }
          });
       });
     }
     else {
       console.log('ERROR - Invalid category: ' + req.params.category);
       res.render('error', {
                   messageVar : 'ERROR. Sorry. We do not have such category' + req.params.category       
       });
     }
   }
  }
}

exports.appUserPanelProductListMy = function(db) {
  return function(req, res){    

     //If user is not loggin refirect to login page
    if (!req.user) {
      res.redirect('/login/'+req.params.lang);
    }
    else { 
     if (validateCategory(req.params.category)) {   
       var productsCol = db.get('products_'+req.params.category);  
       var appLanguageCol = db.get('app_text_language');

       var language = 'en_US';   
       if (req.params.lang == null)
         language = 'en_US'
       else
         language = req.params.lang; 
 
       appLanguageCol.find({"language" : language},function(e,appMenuLangDocs){  
         productsCol.find({'advertisementInfo.adv_Username' : req.user.username, 'advertisementInfo.adv_Status' : 'confirmed'},function(e,productsDocs){  
          res.render('userpanel/userpanel-product-list', { 
             'productsVar'     : productsDocs, 
             'appMenuLangVar'  : appMenuLangDocs,  
             'user'            : req.user, 
             'langVar'         : language,
             'categoryVar'     : req.params.category,
             'menuViewVar'     : req.query.menu
          });
        });
      });
     }
    else {
       console.log('ERROR - Invalid category: ' + req.params.category);
       res.render('error', {
                   messageVar : 'ERROR. Sorry. We do not have such category' + req.params.category       
       });
     }
   }
  }
}

exports.appUserProductItem = function(db) {
 return function(req, res){
     //If user is not loggin refirect to login page
    if (!req.user) {
      res.redirect('/login/'+req.params.lang);
    }
    else { 
     if (validateCategory(req.params.category)) {   
       var productsCol = db.get('products_'+req.params.category);
       var appLanguageCol = db.get('app_text_language');

       var language = 'en_US';   

       if (req.params.lang == null)
         language = 'en_US'
       else
         language = req.params.lang;   

       appLanguageCol.find({"language" : language},function(e,appMenuLangDocs){  
         productsCol.find({'_id' : req.params.id},function(e,productsDocs){
           res.render('userpanel/product-item-'+req.params.category, { 
                                 'productsVar'     : productsDocs, 
                                 'appMenuLangVar'  : appMenuLangDocs,  
                                 'user'            : req.user,
                                 'langVar'         : language,
                                 'categoryVar'     : req.params.category,
                                 'menuViewVar'     : req.query.menu
           });
         });
       });
     }
     else {
       console.log('ERROR - Invalid category: ' + req.params.category);
       res.render('error', {
                   messageVar : 'ERROR. Sorry. We do not have such category' + req.params.category       
       });
     }
   }
 }
}

exports.appUserProductAddConfirm = function(db,mailer) {
  return function(req, res){      
     //If user is not loggin refirect to login page
    if (!req.user) {
      res.redirect('/login/'+req.params.lang);
    }
    else { 
     if (validateCategory(req.params.category)) {  
       var appLanguageCol = db.get('app_text_language');
       var catLevel1Col = db.get('app_text_' + req.params.category + '_level1');
       var catLevel2Col = db.get('app_text_' + req.params.category + '_level2');
       var catLevel3Col = db.get('app_text_' + req.params.category + '_level3');
 
       var productsCol = db.get('products_'+req.params.category); 
       var language = 'en_US';   
       if (req.params.lang == null)
         language = 'en_US'
       else
         language = req.params.lang;   
       appLanguageCol.find({"language" : language},function(e,appMenuLangDocs){  
         productsCol.update({'_id' : req.params.id },{ $set: {'advertisementInfo.adv_Status' : 'confirmed'} },function(error,updProductDocs){
          if (error) {
              console.log('ERROR - Database ERROR: ' + error);
              res.render('error', {
                  messageVar : 'ERROR. While confirming the advertisement with id ' + req.params.id 
              });            
          } else  {
            productsCol.find({'_id' : req.params.id },function(error,productDocs){
              mailer.send('email/email-product-add', {
                to: req.user.contactInfo.con_Email, 
                subject: appMenuLangDocs[0].email_productadd_subject,
                userVar : req.body.username,
                appMenuLangVar: appMenuLangDocs,
                productsVar   : productDocs,
                langVar : language
                }, function (error) {
                  if (error) {
                    console.log(error);
                  }
              });
              if(productDocs[0].categoryInfo.cat_Level1 != '' && productDocs[0].categoryInfo.cat_Level1 != null) {
                catLevel1Col.update({'cat_Level1' : productDocs[0].categoryInfo.cat_Level1 },{ $inc: {'cat_Count' : 1}},function(error,catLevel1Docs){
                  if(error) 
                    console.log(error);
                });
              }
              if(productDocs[0].categoryInfo.cat_Level2 != '' && productDocs[0].categoryInfo.cat_Level2 != null) {
                catLevel2Col.update({'cat_Level1' : productDocs[0].categoryInfo.cat_Level1,'cat_Level2' : productDocs[0].categoryInfo.cat_Level2},{ $inc: {'cat_Count' : 1}},function(error,catLevel2Docs){
                  if(error) 
                    console.log(error);
                });
               }
              if(productDocs[0].categoryInfo.cat_Level3 != '' && productDocs[0].categoryInfo.cat_Level3 != null) {
                catLevel3Col.update({'cat_Level1' : productDocs[0].categoryInfo.cat_Level1,'cat_Level2' : productDocs[0].categoryInfo.cat_Level2,'cat_Level3' : productDocs[0].categoryInfo.cat_Level3},{ $inc: {'cat_Count' : 1}},function(error,catLevel3Docs){
                  if(error) 
                    console.log(error);
                });
             } 
          res.redirect('/userpanel/'+language + '?menu=' + req.query.menu);
         });
        }
       }); 
      }); 
     }
     else {
       console.log('ERROR - Invalid category: ' + req.params.category);
       res.render('error', {
                   messageVar : 'ERROR. Sorry. We do not have such category' + req.params.category       
       });
     }
    }
  }
 }

exports.appUserProductAddSubmit = function(db,fs,mv) {
  return function(req, res){      
      
      var id = req.user._id + '_' + Math.round((new Date()).getTime() / 1000);  
         
      var pathImg  = '/images/products_' + req.params.category + '/' + id + '/';
      var pathDest = './public/images/products_' + req.params.category + '/' + id + '/';

      var files = [];
      var fileKeys = Object.keys(req.files);

      fileKeys.forEach(function(key) {
        if (req.files[key].name != '') {   
          var filePath = req.files[key].path;
          var fileName = filePath.substring(5,filePath.length);
          files.push(pathImg + fileName);
        }
      });

      fs.mkdir(pathDest,function(e){
        if(!e || (e && e.code === 'EEXIST')){
         fileKeys.forEach(function(key) {
           if (req.files[key].name != '') {   
             var filePath = req.files[key].path;
             var fileName = filePath.substring(5,filePath.length);
             mv(req.files[key].path, pathDest + fileName, function(err) {
              if (err) throw err; 
             });  
           }
         });
        }
      });
      
      var jsonAdvertisement = {};

      var bodyKeys = Object.keys(req.body);
      var jsonCategory = {};
      var jsonDetails = {};
      var jsonDescription = {};
      var jsonContact = {};
      var optionsSafety = [];
      var optionsComfort = [];

      var dateInserted = new Date();
      var dateExpired = new Date();
      dateExpired.setDate(dateExpired.getDate()+14);

      jsonAdvertisement['adv_Status']        = 'unconfirmed';
      jsonAdvertisement['adv_Typ']           = 'car';   
      jsonAdvertisement['adv_Viewers']       = 0;
      jsonAdvertisement['adv_DateInserted']  = dateInserted;
      jsonAdvertisement['adv_DateDeleted']   = 0;
      jsonAdvertisement['adv_DateExpired']   = dateExpired;
      jsonAdvertisement['adv_Username']      = req.user.username;
      jsonAdvertisement['adv_Viewers']       = 0;

      bodyKeys.forEach(function(key) {
         var keyPrefix = key.substring(0,4);
         if (keyPrefix == 'cat_')
             jsonCategory[key] = req.body[key];
         if (keyPrefix == 'det_') {
           console.log(key);
           if (key == 'det_Prize') {
             jsonDetails[key] = parseFloat(req.body[key]);            
	   } else if (key == 'det_Year' || key == 'det_Engine' || key == 'det_Mileage') {
             jsonDetails[key] = parseInt(req.body[key]);            
	   } else {
              jsonDetails[key] = req.body[key];
           }
          }
         if (keyPrefix == 'opt_') {
            if (key.substring(4,5) == 's') {
                optionsSafety.push(key.substring(6,key.length))
            }
            if (key.substring(4,5) == 'c') {
               optionsComfort.push(key.substring(6,key.length))
            }
         }
         if (keyPrefix == 'des_')
             jsonDescription[key] = req.body[key];
         if (keyPrefix == 'con_')
             jsonContact[key] = req.body[key];
      });
      
      var product = {
         _id                 : id, 
         advertisementInfo   : jsonAdvertisement,
         categoryInfo        : jsonCategory,
         detailsInfo         : jsonDetails,  
         descriptionInfo     : jsonDescription,  
         contactInfo         : jsonContact,
         optionsSafetyArray  : optionsSafety,
         optionsComfortArray : optionsComfort,
         imagesAray          : files
       }

      var productsCol = db.get('products_'+req.params.category);

      productsCol.insert(product,function(error,ubsertFilter){
         if(error) 
            console.log(error);
          else {
            res.redirect('/userpanel-product-item/'+req.params.lang+'/'+req.params.category+'/'+ubsertFilter._id+'?menu='+req.query.menu);
          }
      });
    }
}
exports.appUserProductAddSubmitService = function(db,fs,mv) {
  return function(req, res){      
      
      var id = req.user._id + '_' + Math.round((new Date()).getTime() / 1000);  
         
      var pathImg  = '/images/products_'+ req.params.category +'/' + id + '/';
      var pathDest = './public/images/products_' + req.params.category + '/' + id + '/';

      var files = [];
      var fileKeys = Object.keys(req.files);

      fileKeys.forEach(function(key) {
        if (req.files[key].name != '') {   
          var filePath = req.files[key].path;
          var fileName = filePath.substring(5,filePath.length);
          files.push(pathImg + fileName);
        }
      });

      fs.mkdir(pathDest,function(e){
        if(!e || (e && e.code === 'EEXIST')){
         fileKeys.forEach(function(key) {
           if (req.files[key].name != '') {   
             var filePath = req.files[key].path;
             var fileName = filePath.substring(5,filePath.length);
             mv(req.files[key].path, pathDest + fileName, function(err) {
              if (err) throw err; 
             });  
           }
         });
        }
      });
      
      var jsonAdvertisement = {};

      var bodyKeys = Object.keys(req.body);
      var jsonCategory = {};
      var jsonDescription = {};
      var jsonContact = {};

      var dateInserted = new Date();
      var dateExpired = new Date();
      dateExpired.setDate(dateExpired.getDate()+14);

      jsonAdvertisement['adv_Status']        = 'unconfirmed';
      jsonAdvertisement['adv_Typ']           = 'service';   
      jsonAdvertisement['adv_Viewers']       = 0;
      jsonAdvertisement['adv_DateInserted']  = dateInserted;
      jsonAdvertisement['adv_DateDeleted']   = 0;
      jsonAdvertisement['adv_DateExpired']   = dateExpired;
      jsonAdvertisement['adv_Username']      = req.user.username;
      jsonAdvertisement['adv_Viewers']       = 0;

      bodyKeys.forEach(function(key) {
         var keyPrefix = key.substring(0,4);
         if (keyPrefix == 'cat_')
             jsonCategory[key] = req.body[key];
         if (keyPrefix == 'des_')
             jsonDescription[key] = req.body[key];
         if (keyPrefix == 'con_')
             jsonContact[key] = req.body[key];
      });
      
      var product = {
         _id                 : id, 
         advertisementInfo   : jsonAdvertisement,
         categoryInfo        : jsonCategory,
         descriptionInfo     : jsonDescription,  
         contactInfo         : jsonContact,
         imagesAray          : files
       }

      var productsCol = db.get('products_'+req.params.category);

      productsCol.insert(product,function(error,ubsertFilter){
         if(error) 
            console.log(error);
          else {
            res.redirect('/userpanel-product-item/'+req.params.lang+'/'+req.params.category+'/'+ubsertFilter._id + '?menu=' + req.query.menu);
          }
      });
    }
}

exports.appUserProductAddSubmitPart = function(db,fs,mv) {
  return function(req, res){      
      
      var id = req.user._id + '_' + Math.round((new Date()).getTime() / 1000);  
         
      var pathImg  = '/images/products_'+ req.params.category +'/' + id + '/';
      var pathDest = './public/images/products_' + req.params.category + '/' + id + '/';

      var files = [];
      var fileKeys = Object.keys(req.files);

      fileKeys.forEach(function(key) {
        if (req.files[key].name != '') {   
          var filePath = req.files[key].path;
          var fileName = filePath.substring(5,filePath.length);
          files.push(pathImg + fileName);
        }
      });

      fs.mkdir(pathDest,function(e){
        if(!e || (e && e.code === 'EEXIST')){
         fileKeys.forEach(function(key) {
           if (req.files[key].name != '') {   
             var filePath = req.files[key].path;
             var fileName = filePath.substring(5,filePath.length);
             mv(req.files[key].path, pathDest + fileName, function(err) {
              if (err) throw err; 
             });  
           }
         });
        }
      });
      
      var jsonAdvertisement = {};

      var bodyKeys = Object.keys(req.body);
      var jsonCategory = {};
      var jsonDetails = {};
      var jsonDescription = {};
      var jsonContact = {};

      var dateInserted = new Date();
      var dateExpired = new Date();
      dateExpired.setDate(dateExpired.getDate()+14);

      jsonAdvertisement['adv_Status']        = 'unconfirmed';
      jsonAdvertisement['adv_Typ']           = 'part';   
      jsonAdvertisement['adv_Viewers']       = 0;
      jsonAdvertisement['adv_DateInserted']  = dateInserted;
      jsonAdvertisement['adv_DateDeleted']   = 0;
      jsonAdvertisement['adv_DateExpired']   = dateExpired;
      jsonAdvertisement['adv_Username']      = req.user.username;
      jsonAdvertisement['adv_Viewers']       = 0;

      bodyKeys.forEach(function(key) {
         var keyPrefix = key.substring(0,4);
         if (keyPrefix == 'cat_')
             jsonCategory[key] = req.body[key];
         if (keyPrefix == 'det_')
             jsonDetails[key] = req.body[key];
         if (keyPrefix == 'des_')
             jsonDescription[key] = req.body[key];
         if (keyPrefix == 'con_')
             jsonContact[key] = req.body[key];
      });
      
      var product = {
         _id                 : id, 
         advertisementInfo   : jsonAdvertisement,
         categoryInfo        : jsonCategory,
         detailsInfo         : jsonDetails,
         descriptionInfo     : jsonDescription,  
         contactInfo         : jsonContact,
         imagesAray          : files
       }

      var productsCol = db.get('products_'+req.params.category);

      productsCol.insert(product,function(error,ubsertFilter){
         if(error) 
            console.log(error);
          else {
            res.redirect('/userpanel-product-item/'+req.params.lang+'/'+req.params.category+'/'+ubsertFilter._id+'?menu='+req.query.menu);
          }
      });
    }
}

exports.appUserProductAddPayPalPost = function(db) {
  return function(req, res){   
    console.log('GOT SUCCESS FROM PAYPAL');
    console.log(res);
    console.log(req);
  }
}

exports.appUserContact = function(db, mailer) {
  return function(req, res){   
     var language = 'en_US';   

     if (req.params.lang == null)
        language = 'en_US'
     else
        language = req.params.lang;   

     var appLanguageCol = db.get('app_text_language');

    console.log(req.body);

             mailer.send('email/email-contact-us', {
                from: req.body.email_From,
                to: 'appuser@wheeldealer.ca', 
                subject: req.body.email_Subject,
                dataVar: req.body.email_Data,
                langVar : req.params.lang
                }, function (error) {
                  if (error) {
                    console.log(error);
                  } else {
                      //res.redirect('/'+language + '/');
                      res.redirect('back');
                  }
      });
 }     
}

validateCategory  = function(category) {
 if (category == 'car') {  
    return true;
 } else
 if (category == 'partcar') {  
    return true;
 } else
 if (category == 'motor') {  
    return true;
 } else  
 if (category == 'partmotor') {  
    return true;
 } else  
 if (category == 'dealer') {  
    return true;
 } 
 if (category == 'service') {  
    return true;
 } 
 else 
    return false
}

