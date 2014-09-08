var today=new Date();
db.products_car.update( {"advertisementInfo.adv_Status" : "confirmed", "advertisementInfo.adv_DateExpired" : { "$lt" : today}}, {"$set": {"advertisementInfo.adv_Status" : "expired"}}, { multi: true } );
db.products_motor.update( {"advertisementInfo.adv_Status" : "confirmed", "advertisementInfo.adv_DateExpired" : { "$lt" : today}}, {"$set": {"advertisementInfo.adv_Status" : "expired"}}, { multi: true } );
db.products_partcar.update( {"advertisementInfo.adv_Status" : "confirmed", "advertisementInfo.adv_DateExpired" : { "$lt" : today}}, {"$set": {"advertisementInfo.adv_Status" : "expired"}}, { multi: true } );
db.products_partmotor.update( {"advertisementInfo.adv_Status" : "confirmed", "advertisementInfo.adv_DateExpired" : { "$lt" : today}}, {"$set": {"advertisementInfo.adv_Status" : "expired"}}, { multi: true } );
db.products_service.update( {"advertisementInfo.adv_Status" : "confirmed", "advertisementInfo.adv_DateExpired" : { "$lt" : today}}, {"$set": {"advertisementInfo.adv_Status" : "expired"}}, { multi: true } );
db.products_dealer.update( {"advertisementInfo.adv_Status" : "confirmed", "advertisementInfo.adv_DateExpired" : { "$lt" : today}}, {"$set": {"advertisementInfo.adv_Status" : "expired"}}, { multi: true } );
