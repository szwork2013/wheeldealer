exports.appProductList = function(db) {
 return function(req, res){
      var category = 'partmotor'; 
 
      var traPerPage = req.params.traPerPage;
      var skipTran = parseInt(req.params.page)*traPerPage;
      var menuLevel = 0;

      var productsCol     = db.get('products_'+ category);
      var appLanguageCol = db.get('app_text_language');

      var language = 'en_US';
      
      var sortAsc = {};
      
      if (req.params.sort == 0) 
        sortAsc = {'advertisementInfo.adv_DateInserted' : 1};
      else if (req.params.sort == 1) 
        sortAsc = {'advertisementInfo.adv_DateInserted' : -1};
      else if (req.params.sort == 2) 
        sortAsc = {'advertisementInfo.adv_DateExpired' : 1};
      else if (req.params.sort == 3) 
        sortAsc = {'advertisementInfo.adv_DateExpired' : -1};
      else if (req.params.sort == 4) 
        sortAsc = {'detailsInfo.det_Prize' : 1};
      else if (req.params.sort == 5) 
        sortAsc = {'detailsInfo.det_Prize' : -1};
      else 
        sortAsc = {'advertisementInfo.adv_DateInserted' : 1};

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

      appLanguageCol.find({"language" : language},function(error,appMenuLangDocs){  
        if(error || appMenuLangDocs == undefined) {
          logError4(res,error,query,'EPM0011');
        } else {
         productsCol.distinct('categoryInfo.cat_Level1',query,function(error,appMenuCatLevel1Docs) {
          if(error) {
           logError4(res,error,query,'EPM0012');
          } else {
          productsCol.distinct('categoryInfo.cat_Level2',query,function(error,appMenuCatLevel2Docs) {
            if(error) {
              logError4(res,error,query,'EPM0013');
            } else {
              productsCol.count(query,function(error,productsCnt) {
             if(error) {
                logError4(res,error,query,'EPM0014');
             } else {
              var pageCnt = Math.ceil(productsCnt / traPerPage);
                 productsCol.find(query,{sort:sortAsc,limit:traPerPage,skip:skipTran},function(error,productsDocs){
                if(error) {
                  logError4(res,error,query,'EPM0015');
                } else {
                    res.render('partmotor/index-partmotor', { 
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
                                'appMenuLangVar'      : appMenuLangDocs, 
                                'appMenuLevelVar'     : menuLevel,  
                                'productsVar'         : productsDocs, 
                                'catLevel1Var'        : req.params.catLevel1,
                                'catLevel2Var'        : req.params.catLevel2,
                                'catLevel3Var'        : 0
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
     var category = 'partmotor';
     var productsCol = db.get('products_partmotor');
     var appLanguageCol = db.get('app_text_language');

     var language = 'en_US';   

     if (req.params.lang == null)
       language = 'en_US'
     else
        language = req.params.lang
   
      appLanguageCol.find({"language" : language},function(error,appMenuLangDocs){  
       if(error || appMenuLangDocs[0] == undefined) {
            logError3(res,error,'EPM0021');
        } else {
          productsCol.update({'_id' : req.params.id },{ $inc: {'advertisementInfo.adv_Viewers' : 1}},function(error,advViewsCntDocs){    
            if(error) {
              logError3(res,error,'EPM0022');
             } else {
               productsCol.find({'_id' : req.params.id},function(error,productsDocs){
                  if(error || productsDocs[0] == undefined) {
                    logError3(res,error,'EPM0023');
                  } else {
                     res.render('partmotor/product-item-partmotor', { 
                                          'appMenuLangVar'  : appMenuLangDocs, 
                                          'appMenuLevelVar' : 1,                                           
                                          'catLevel1Var'    : productsDocs[0].categoryInfo.cat_Level1, 
                                          'catLevel2Var'    : productsDocs[0].categoryInfo.cat_Level2, 
                                          'productsVar'     : productsDocs, 
                                          'user'            : req.user, 
                                          'searchVar'       : req.params.searchView, 
                                          'langVar'         : language,
                                          'menuViewVar'     : req.query.menu,
                                          'traPerPageVar'   : req.params.traPerPage,
                                          'sortVar'         : req.params.sort
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
