/*
 * GET home page.
 */

exports.index = function(db) {

 return function(req, res){
    var traPerPage = 1;
    var skipTran = 0;

    var products1Col = db.get('products_car');
    var products2Col = db.get('products_motor');
    var products3Col = db.get('products_partcar');
    var products4Col = db.get('products_partmotor');
    var products5Col = db.get('products_dealer');
    var products6Col = db.get('products_service');
    var appLanguageCol = db.get('app_text_language');
    var appGlobalVisitorsCol = db.get('app_global_visitors');

    var language = 'en_US';   

    if (req.params.lang == null) {
      language = 'en_US';
      
      dateToday = new Date();
      
      var jsonDate = {};
      jsonDate['year']  = dateToday.getFullYear();
      jsonDate['month'] = dateToday.getMonth()+1;
      jsonDate['day']   = dateToday.getDate();
      jsonDate['count']   = 1;

      appGlobalVisitorsCol.update({'year' :  dateToday.getFullYear(),'month' : dateToday.getMonth()+1,'day' : dateToday.getDate()},{ $inc: {'count' : 1}},function(error,advViewsCntDocs){
         if (advViewsCntDocs == 0) {
           appGlobalVisitorsCol.insert(jsonDate,function(error,advViewsCntDocs){
           });
         }            
      });
    }
    else {
       language = req.params.lang;   
    }

    appLanguageCol.find({"language" : language},function(error,appMenuLangDocs){
     if(error || appMenuLangDocs[0] == undefined) {
       logError3(res,error,'EG00001');
     } else {
         products1Col.find({'advertisementInfo.adv_Status' : 'confirmed'},{sort:{'advertisementInfo.adv_Viewers' : -1},limit:1},function(error,products1Docs) {
          if(error) {
            logError3(res,error,'EG00002');
          } else {
              products2Col.find({'advertisementInfo.adv_Status' : 'confirmed'},{sort:{'advertisementInfo.adv_Viewers' : -1},limit:1},function(error,products2Docs) {
          if(error) {
            logError3(res,error,'EG00003');
          } else {

           products3Col.find({'advertisementInfo.adv_Status' : 'confirmed'},{sort:{'advertisementInfo.adv_Viewers' : -1},limit:1},function(error,products3Docs) {
          if(error) {
            logError3(res,error,'EG00004');
          } else {
            products4Col.find({'advertisementInfo.adv_Status' : 'confirmed'},{sort:{'advertisementInfo.adv_Viewers' : -1},limit:1},function(error,products4Docs) {
          if(error) {
            logError3(res,error,'EG00005');
          } else {
             products5Col.find({'advertisementInfo.adv_Status' : 'confirmed'},{sort:{'advertisementInfo.adv_Viewers' : -1},limit:1},function(error,products5Docs) {
          if(error) {
            logError3(res,error,'EG00006');
          } else {
              products6Col.find({'advertisementInfo.adv_Status' : 'confirmed'},{sort:{'advertisementInfo.adv_Viewers' : -1},limit:1},function(error,products6Docs) {
          if(error) {
            logError3(res,error,'EG00007');
          } else {
              res.render('index', { 
                               'appMenuLangVar'  : appMenuLangDocs, 
                               'appMenuLevelVar' : 0, 
                               'commSlide1Var'   : products1Docs, 
                               'commSlide2Var'   : products2Docs, 
                               'commSlide3Var'   : products3Docs, 
                               'commSlide4Var'   : products4Docs, 
                               'commSlide5Var'   : products5Docs, 
                               'commSlide6Var'   : products6Docs, 
                               'user'            : req.user,
                               'indexVar'        : 1,
                               'searchVar'       : 0,
                               'langVar'         : language
              });};
             });};
            });};
           });};
          });};
         });};
      });};
    });};
}

exports.appContactUs = function(db) {
 return function(req, res) {
    var appLanguageCol = db.get('app_text_language');
    var language = 'en_US';   

    if (req.params.lang == null)
      language = 'en_US'
    else
       language = req.params.lang;   
    
    appLanguageCol.find({"language" : language},function(error,appMenuLangDocs){
     if(error || appMenuLangDocs[0] == undefined) {
       logError3(res,error,'EG00008');
     } else {
       res.render('footer-contact-us', { 
                               'appMenuLangVar'  : appMenuLangDocs, 
                               'user'            : req.user,
                               'langVar'         : language,
                               'userToVar'       : 'support@wheeldealer.ca'
       });};
    });
 }
}

exports.appContactUsPost = function(db,mailer) {
 return function(req, res) {
     var appLanguageCol = db.get('app_text_language');
     var language = 'en_US';   

     if (req.params.lang == null)
       language = 'en_US'
     else
        language = req.params.lang

       appLanguageCol.find({"language" : language},function(error,appMenuLangDocs){
        if(error || appMenuLangDocs[0] == undefined) {
         logError3(res,error,'EG00009');
        } else {
                mailer.send('email/email-contact-user', {
                            to             : req.body.email_To,
                            from           : req.body.email_From,
                            subject        : req.body.email_Subject,
                            appMenuLangVar : appMenuLangDocs
                },function(error,mailDocs){ 
                   if (!error) {
                     res.redirect('back');
                   }
                   else {
                     logError3(res,error,'EG00010');
                   }
                });};                                  
      });
 }
}

exports.appAdvertiseWithUs = function(db) {
 return function(req, res) {
    var appLanguageCol = db.get('app_text_language');
    var language = 'en_US';   

    if (req.params.lang == null)
      language = 'en_US'
    else
       language = req.params.lang;   
    
    appLanguageCol.find({"language" : language},function(error,appMenuLangDocs){
     if(error || appMenuLangDocs[0] == undefined) {
       logError3(res,error,'EG00011');
     }
     else {
       res.render('footer-advertise-us', { 
                              'appMenuLangVar'   : appMenuLangDocs, 
                               'user'            : req.user,
                               'langVar'         : language,
                               'userToVar'       : 'advertise@wheeldealer.ca'
   
       });};
    });
 }
}


function logError4(res, error, query, errorNo) {
   console.log('ERROR - ' + errorNo + ' - Database ERROR: ' + error);
   console.log('ERROR - ' + errorNo + ' - Invalid query: ' + JSON.stringify(query));
   res.render('error', {
           messageVar : 'ERROR - '+ errorNo +'. Sorry. There was and error while requesting data' 
   });
}

function logError3(res, error, errorNo) {
   console.log('ERROR - ' + errorNo + ' - Database ERROR: ' + error);
   res.render('error', {
           messageVar : 'ERROR - '+ errorNo +'. Sorry. There was and error while requesting data' 
   });
}
