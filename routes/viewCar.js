exports.appProductList = function(db) {
 return function(req, res){
      var category = 'car'; 
 
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
      if (req.params.catLevel3 != '0') {
        query["$and"].push(JSON.parse('{ \"categoryInfo.cat_Level3\" : \"'+ req.params.catLevel3 + '\" }'));
        menuLevel = 3;
      }
      if (req.params.body != 0)
        query["$and"].push(JSON.parse('{ \"detailsInfo.det_Body\" : \"'+ req.params.body + '\" }'));
      if (req.params.transmition != 0)
        query["$and"].push(JSON.parse('{ \"detailsInfo.det_Transmition\" : \"'+ req.params.transmition + '\" }'));
      if (req.params.color != 0)
        query["$and"].push(JSON.parse('{ \"detailsInfo.det_Color\" : \"'+ req.params.color + '\" }'));
      if (req.params.fuel != 0)
        query["$and"].push(JSON.parse('{ \"detailsInfo.det_Fuel\" : \"'+ req.params.fuel + '\" }'));
      if (req.params.minYear != 0)
        query["$and"].push(JSON.parse('{ \"detailsInfo.det_Year\" : { \"$gte\" : '+ parseInt(req.params.minYear) + ' } }'));
      if (req.params.maxYear != 0)
        query["$and"].push(JSON.parse('{ \"detailsInfo.det_Year\" : {\"$lte\" : '+ parseInt(req.params.maxYear) + ' }}'));
      if (req.params.minEngine != 0)
        query["$and"].push(JSON.parse('{ \"detailsInfo.det_Engine\" : {\"$gte\" : '+ parseInt(req.params.minEngine) + ' }}'));
      if (req.params.maxEngine != 0)
        query["$and"].push(JSON.parse('{ \"detailsInfo.det_Engine\" : {\"$lte\" : '+ parseInt(req.params.maxEngine) + ' }}'));
      if (req.params.minMileage != 0)
        query["$and"].push(JSON.parse('{ \"detailsInfo.det_Mileage\" : {\"$gte\" : '+ parseInt(req.params.minMileage) + ' }}'));
      if (req.params.maxMileage != 0)
        query["$and"].push(JSON.parse('{ \"detailsInfo.det_Mileage\" : {\"$lte\" : '+ parseInt(req.params.maxMileage) + ' }}'));
      if (req.params.minPrize != 0)
        query["$and"].push(JSON.parse('{ \"detailsInfo.det_Prize\" : {\"$gte\" : '+ parseFloat(req.params.minPrize) + ' }}'));
      if (req.params.maxPrize != 0)
        query["$and"].push(JSON.parse('{ \"detailsInfo.det_Prize\" : {\"$lte\" : '+ parseFloat(req.params.maxPrize) + '}}'));   
      if (req.params.city != 0)
        query["$and"].push(JSON.parse('{ \"contactInfo.con_City\" : \"'+ req.params.city + '\" }'));
      if (req.params.country != 0)
        query["$and"].push(JSON.parse('{ \"contactInfo.con_Country\" : \"'+ req.params.country + '\" }'));

      appLanguageCol.find({"language" : language},function(error,appMenuLangDocs){  
        if(error || appMenuLangDocs[0] == undefined) {
          logError4(res,error,query,'EVC0011');
        } else {
         productsCol.distinct('categoryInfo.cat_Level1',query,function(error,appMenuCatLevel1Docs) {
          if(error) {
            logError4(res,error,query,'EVC0012');
          } else {
          productsCol.distinct('categoryInfo.cat_Level2',query,function(error,appMenuCatLevel2Docs) {
            if(error) {
             logError4(res,error,query,'EVC0013');
            } else {
            productsCol.distinct('categoryInfo.cat_Level3',query,function(error,appMenuCatLevel3Docs) {
             if(error) {
                logError4(res,error,query,'EVC0014');
             }  else {
              productsCol.count(query,function(error,productsCnt) {
             if(error) {
                logError4(res,error,query,'EVC0015');
             } else {
              var pageCnt = Math.ceil(productsCnt / traPerPage);
                 productsCol.find(query,{sort:sortAsc,limit:traPerPage,skip:skipTran},function(error,productsDocs){
                if(error) {
                  logError4(res,error,query,'EVC0016');
                } else {
                    res.render('car/index-car', { 
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
                                'catLevel3Var'        : req.params.catLevel3,
                                'bodyVar'         : req.params.body,
                                'transmitionVar'  : req.params.transmition,
                                'colorVar'        : req.params.color,
                                'fuelVar'         : req.params.fuel,
                                'minYearVar'      : req.params.minYear,
                                'maxYearVar'      : req.params.maxYear,
                                'minEngineVar'    : req.params.minEngine,
                                'maxEngineVar'    : req.params.maxEngine,
                                'minMileageVar'   : req.params.minMileage,
                                'maxMileageVar'   : req.params.maxMileage,
                                'minPrizeVar'     : req.params.minPrize,
                                'maxPrizeVar'     : req.params.maxPrize,
                                'cityVar'         : req.params.city,
                                'countryVar'      : req.params.country
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
     var category = 'car';
     var productsCol = db.get('products_car');
     var appLanguageCol = db.get('app_text_language');

     var language = 'en_US';   

     if (req.params.lang == null)
       language = 'en_US'
     else
        language = req.params.lang
   
      appLanguageCol.find({"language" : language},function(error,appMenuLangDocs){  
       if(error || appMenuLangDocs[0] ==  undefined) {
            logError3(res,error,'EVC0021');
        } else {
          productsCol.update({'_id' : req.params.id },{ $inc: {'advertisementInfo.adv_Viewers' : 1}},function(error,advViewsCntDocs){    
            if(error) {
              logError3(res,error,'EVC0022');
             } else {
               productsCol.find({'_id' : req.params.id},function(error,productsDocs){
                  if(error || productsDocs[0] == undefined) {
                    logError3(res,error,'EVC0023');
                  } else {
                     var appMenuCol = db.get('app_text_car_typ');
                     appMenuCol.find({"car" : productsDocs[0].categoryInfo.cat_Level1,"model" : productsDocs[0].categoryInfo.cat_Level2, "typ" : productsDocs[0].categoryInfo.cat_Level3},function(e,appMenuDocs){
                     res.render('car/product-item-car', { 
                                'user'            : req.user,
                                'langVar'         : language,
                                'categoryVar'     : category,
                                'searchVar'       : req.params.searchView,
                                'menuViewVar'     : req.query.menu,
                                'traPerPageVar'   : req.params.traPerPage,
                                'sortVar'         : req.params.sort,
                                'appMenuVar'      : appMenuDocs, 
                                'appMenuLangVar'  : appMenuLangDocs, 
                                'appMenuLevelVar' : 3,                                           
                                'catLevel1Var'    : productsDocs[0].categoryInfo.cat_Level1, 
                                'catLevel2Var'    : productsDocs[0].categoryInfo.cat_Level2, 
                                'catLevel3Var'    : productsDocs[0].categoryInfo.cat_Level3, 
                                'productsVar'     : productsDocs, 
/*Product specific*/
                                'bodyVar'         : req.params.body,
                                'transmitionVar'  : req.params.transmition,
                                'colorVar'        : req.params.color,
                                'fuelVar'         : req.params.fuel,
                                'minYearVar'      : req.params.minYear,
                                'maxYearVar'      : req.params.maxYear,
                                'minEngineVar'    : req.params.minEngine,
                                'maxEngineVar'    : req.params.maxEngine,
                                'minMileageVar'   : req.params.minMileage,
                                'maxMileageVar'   : req.params.maxMileage,
                                'minPrizeVar'     : req.params.minPrize,
                                'maxPrizeVar'     : req.params.maxPrize,
                                'cityVar'         : req.params.city,
                                'countryVar'      : req.params.country
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

exports.appProductSearch  = function() {
  return function(req, res){
    
    var cat_Level1      = '0';
    var cat_Level2      = '0';
    var cat_Level3      = '0';
    var det_Body        = '0';
    var det_Transmition = '0';
    var det_Color       = '0';
    var det_Fuel        = '0';
    var det_MinYear     = '0';
    var det_MaxYear     = '0';
    var det_MinEngine   = '0';
    var det_MaxEngine   = '0';
    var det_MinMileage  = '0';
    var det_MaxMileage  = '0';
    var det_MinPrize    = '0';
    var det_MaxPrize    = '0';
    var con_City        = '0';
    var con_Country     = '0';

    if (req.body.cat_Level1 != '')      cat_Level1      = req.body.cat_Level1; 
    if (req.body.cat_Level2 != '')      cat_Level2      = req.body.cat_Level2; 
    if (req.body.cat_Level3 != '')      cat_Level3      = req.body.cat_Level3; 
    if (req.body.det_Body != '')        det_Body        = req.body.det_Body; 
    if (req.body.det_Transmition != '') det_Transmition = req.body.det_Transmition; 
    if (req.body.det_Color != '')       det_Color       = req.body.det_Color; 
    if (req.body.det_Fuel != '')        det_Fuel        = req.body.det_Fuel; 
    if (req.body.det_MinYear != '')     det_MinYear     = req.body.det_MinYear; 
    if (req.body.det_MaxYear != '')     det_MaxYear     = req.body.det_MaxYear; 
    if (req.body.det_MinEngine != '')   det_MinEngine   = req.body.det_MinEngine; 
    if (req.body.det_MaxEngine != '')   det_MaxEngine   = req.body.det_MaxEngine; 
    if (req.body.det_MinMileage != '')  det_MinMileage  = req.body.det_MinMileage; 
    if (req.body.det_MaxMileage != '')  det_MaxMileage  = req.body.det_MaxMileage; 
    if (req.body.det_MinPrize != '')    det_MinPrize    = req.body.det_MinPrize; 
    if (req.body.det_MaxPrize != '')    det_MaxPrize    = req.body.det_MaxPrize; 
    if (req.body.con_City != '')        con_City        = req.body.con_City; 
    if (req.body.con_Country != '')     con_Country     = req.body.con_Country;   
 
    res.redirect('/index-car/'+req.params.lang+'/50/0/1/0/0/'+cat_Level1+'/'+cat_Level2+'/'+cat_Level3+'/'+det_Body+'/'+det_Transmition+'/'+det_Color+'/'+det_Fuel+'/'+det_MinYear+'/'+det_MaxYear+'/'+det_MinEngine+'/'+det_MaxEngine+'/'+det_MinMileage+'/'+det_MaxMileage+'/'+det_MinPrize+'/'+det_MaxPrize+'/'+con_City+'/'+con_Country +'?menu=' +req.query.menu );
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
