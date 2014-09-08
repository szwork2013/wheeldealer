exports.appAdminPanel = function(db) {
 return function(req, res){
    res.render('adminpanel/adminpanel', {  });
 }
}

exports.appAdminPanelMenuAddCar = function(db) {
 return function(req, res){
     var carCol   = db.get('app-text-car');
     var modelCol = db.get('app-text-car-model');
     var typCol   = db.get('app-text-car-typ');     
    
       carCol.find({$query: {}, $orderby: { car : 1 }},function(e,carDocs){         
        if (req.params.menuLevel == 0) {
           res.render('adminpanel/adminpanel-menu-add-car', {
                                           'carVar' : carDocs, 
                                           'menuLevelVar' : req.params.menuLevel,
                                           'catLevel1LabelVar' : 'Select Car',
                                           'catLevel2LabelVar' : 'Select Model', 
                                           'catLevel3LabelVar' : 'Select Version', 
                                           'user' : req.user});
        }
        if (req.params.menuLevel == 1) {
          modelCol.find({$query: {'car' : req.params.car},$orderby: { model : 1 }} ,function(e,modelDocs){ 
            res.render('adminpanel/adminpanel-menu-add-car', {
                                            'carVar' : carDocs, 
                                            'modelVar' : modelDocs,
                                            'menuLevelVar' : 2,
                                            'catLevel1LabelVar' : req.params.car,
                                            'catLevel2LabelVar' : 'Select Model', 
                                            'catLevel3LabelVar' : 'Select Version', 
                                            'user' : req.user});
          });
        }
        if (req.params.menuLevel == 2) {
           modelCol.find({$query:{'car' : req.params.car },$orderby:{model : 1}},function(e,modelDocs){ 
             typCol.find({$query:{'car' : req.params.car, 'model' : req.params.model},$orderby:{typ : 1}},function(e,typDocs){ 
               res.render('adminpanel/adminpanel-menu-add-car', {
                                             'carVar' : carDocs, 
                                             'modelVar' : modelDocs, 
                                             'typVar' : typDocs, 
                                             'menuLevelVar' : 3, 
                                             'catLevel1LabelVar' : req.params.car,
                                             'catLevel2LabelVar' : req.params.model, 
                                             'catLevel3LabelVar' : 'Select Version', 
                                             'user' : req.user});
             });
           });
        }
        if (req.params.menuLevel == 3) {
           modelCol.find({$query:{'car' : req.params.car },$orderby:{model : 1}},function(e,modelDocs){ 
             typCol.find({$query:{'car' : req.params.car, 'model' : req.params.model},$orderby:{typ : 1}},function(e,typDocs){ 
               res.render('adminpanel/adminpanel-menu-add-car', {
                                              'carVar' : carDocs, 
                                              'modelVar' : modelDocs, 
                                              'typVar' : typDocs, 
                                              'menuLevelVar' : 3, 
                                              'catLevel1LabelVar' : req.params.car,
                                              'catLevel2LabelVar' : req.params.model, 
                                              'catLevel3LabelVar' : req.params.typ, 
                                              'user' : req.user});
             });
           });
        }
      });
   }
}

exports.appAdminMenuAddCar = function(db) {
 return function(req, res){

 var car = {
             car : req.body.dCar
           }  
      var insertCol = db.get('app-text-car');
      insertCol.insert(car,function(error,ubsert){
         if(error) 
            console.log(error);
         else 
            res.redirect('/adminpanel-menu-add-car/0/0/0/0');      
      });
 }
}

exports.appAdminMenuAddCarModel = function(db) {
 return function(req, res){

 var model = {
             car   : req.body.dCar,
             model : req.body.dModel
           }  

      var insertCol = db.get('app-text-car-model');

      insertCol.insert(model,function(error,ubsert){
         if(error) 
            console.log(error);       
         else 
            res.redirect('/adminpanel-menu-add-car/0/0/0/0');      
      });
 }
}

exports.appAdminMenuAddCarTyp = function(db) {
 return function(req, res){

 var typ = {
             car   : req.body.dCar,
             model : req.body.dModel,
             typ   : req.body.dTyp,
           }  

      var insertCol = db.get('app-text-car-typ');

      insertCol.insert(typ,function(error,ubsert){
         if(error) 
            console.log(error);       
         else 
            res.redirect('/adminpanel-menu-add-car/0/0/0/0');      

      });
 }
}

