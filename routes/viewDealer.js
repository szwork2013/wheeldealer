exports.appProductList = function(db) {
 return function(req, res){
      var category = 'dealer'; 

      var traPerPage = req.params.traPerPage;;
      var skipTran = parseInt(req.params.page)*traPerPage;
      var menuLevel = 0;

      var productsCol     = db.get('products_dealer');
      var appLanguageCol = db.get('app_text_language');

      var language = 'en_US';   

      if (req.params.lang == null)
        language = 'en_US'
      else
        language = req.params.lang;   

      var query = {};
      query["$and"]=[];
      query["$and"].push(JSON.parse('{ \"advertisementInfo.adv_Status\" : \"confirmed\" }'));
      if (req.params.catLevel1 != '0') {
        query["$and"].push(JSON.parse('{ \"categoryInfo.cat_Level1\" : \"'+ req.params.catLevel1 + '\" }'));
        menuLevel = 1;
      }
      if (req.params.catLevel2 != '0') {
        query["$and"].push(JSON.parse('{ \"categoryInfo.cat_Level2\" : \"'+ req.params.catLevel2 + '\" }'));
        menuLevel = 2;
      }
     if (req.params.catLevel3 != '0') {
        query["$and"].push(JSON.parse('{ \"categoryInfo.cat_Level3\" : \"'+ req.params.catLevel3 + '\" }'));
        menuLevel = 3;
      }

      appLanguageCol.find({"language" : language},function(error,appMenuLangDocs){  
        if(error || appMenuLangDocs[0] == undefined) {
          logError4(res,error,query,'ESD0011');
        } else {
         productsCol.distinct('categoryInfo.cat_Level1',query,function(error,appMenuCatLevel1Docs) {
          if(error) {
            logError4(res,error,query,'ESD0012');
          } else {
           productsCol.distinct('categoryInfo.cat_Level2',query,function(error,appMenuCatLevel2Docs) {
            if(error) {
              logError4(res,error,query,'ESD0013');
            } else {
            productsCol.distinct('categoryInfo.cat_Level3',query,function(error,appMenuCatLevel3Docs) {
             if(error) {
              logError4(res,error,query,'ESD0014');
             } else {
              productsCol.count(query,function(error,productsCnt) {
             if(error) {
                logError4(res,error,query,'ESD0015');
             } else {
              var pageCnt = Math.ceil(productsCnt / traPerPage);
               productsCol.find({$query: query},{limit:traPerPage,skip:skipTran},function(error,productsDocs){
                if(error) {
                logError4(res,error,query,'ESD0016');
               } else {
                    res.render('dealer/index-dealer', { 
                                'user'            : req.user,
                                'langVar'         : language,
                                'categoryVar'     : category,
                                'searchVar'       : req.params.searchView,
                                'pageVar'         : req.params.page,
                                'menuViewVar'     : req.query.menu,
                                'traPerPageVar'   : req.params.traPerPage,
                                'sortVar'         : req.params.sort,
                                'pageCntVar'      : pageCnt,
/*Product specific*/

                                'appMenuCatLevel1Var' : appMenuCatLevel1Docs.sort(),
                                'appMenuCatLevel2Var' : appMenuCatLevel2Docs.sort(),
                                'appMenuCatLevel3Var' : appMenuCatLevel3Docs.sort(), 
                                'appMenuLangVar'      : appMenuLangDocs, 
                                'appMenuLevelVar'     : menuLevel,  
                                'productsVar'         : productsDocs, 
                                'catLevel1Var'        : req.params.catLevel1,
                                'catLevel2Var'        : req.params.catLevel2,
                                'catLevel3Var'        : req.params.catLevel3
                   });};
                 });};
              });};
             });};
           });};
       });};
     });
  }
}

exports.appProductItem = function(db) {

 return function(req, res){
     var category = 'dealer';
     var productsCol = db.get('products_dealer');
     var appLanguageCol = db.get('app_text_language');

     var language = 'en_US';   

     if (req.params.lang == null)
       language = 'en_US'
     else
        language = req.params.lang
   
      appLanguageCol.find({"language" : language},function(error,appMenuLangDocs){  
       if(error || appMenuLangDocs[0] == undefined) {
          logError3(res,error,'ESD0021');
        } else {
          productsCol.update({'_id' : req.params.id },{ $inc: {'advertisementInfo.adv_Viewers' : 1}},function(error,advViewsCntDocs){    
            if(error) {
              logError3(res,error,'ESD0022');
             } else {
               productsCol.find({'_id' : req.params.id},function(error,productsDocs){
                  if(error || productsDocs[0] == undefined) {
                   logError3(res,error,'ESD0023');
                  } else {
                     var appMenuCol = db.get('app_text_service_level2');
                     appMenuCol.find({"cat_Level1" : productsDocs[0].categoryInfo.cat_Level1,"cat_Level2" : productsDocs[0].categoryInfo.cat_Level2},function(e,appMenuDocs){
                     res.render('dealer/product-item-dealer', { 
                                'user'            : req.user,
                                'langVar'         : language,
                                'categoryVar'     : category,
                                'searchVar'       : req.params.searchView,
                                'menuViewVar'     : req.query.menu,
                                'traPerPageVar'   : req.params.traPerPage,
                                'sortVar'         : req.params.sort,

/*Product specific*/

                                          'appMenuVar'      : appMenuDocs, 
                                          'appMenuLangVar'  : appMenuLangDocs, 
                                          'appMenuLevelVar' : 2,                                           
                                          'catLevel1Var'    : productsDocs[0].categoryInfo.cat_Level1, 
                                          'catLevel2Var'    : productsDocs[0].categoryInfo.cat_Level2, 
                                          'productsVar'     : productsDocs
                  });
         });
         } 
        });
       }
     });
    };
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
