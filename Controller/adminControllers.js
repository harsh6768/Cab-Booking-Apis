var boom=require('boom');
var db=require('../Model/sql.db');

function adminGetBookings(request,reply){


    var sql=`select users.id,users.name,users.email,users.phone ,booking.from_place,booking.to_place,booking.date_time
    from booking
    inner join users
    on booking.users_fk=users.id`;

    db.query(sql,function(err,bookings){
       if(err) throw boom.boomify();
       reply(bookings);
    });

}

function adminGetBookingsWithUserId(request,reply){

     //console.log(request);
     var userId=request.params.user_id;
     //console.log(userId);
     var sql=`select users.id,users.name,users.email,users.phone,booking.from_place,booking.to_place,booking.date_time
        from booking 
        inner join users 
        on booking.users_fk=users.id 
        AND booking.users_fk=?`;
 
     db.query(sql,userId,function(err,bookings){
         if(err) throw boom.boomify();
         reply(bookings);
     });


}

function adminGetBookingsWithDateFilter(request,reply){

    var from_date=new Date(request.params.from_date);
    var to_date=new Date(request.params.to_date);

    var sql=`select users.id,users.email,users.phone,booking.from_place,booking.to_place,booking.date_time
       from booking 
       inner join users 
       on booking.users_fk=users.id 
       AND booking.date_time>=? AND booking.date_time<=?`;

    db.query(sql,[from_date,to_date],function(err,bookings){
        if(err) throw boom.boomify();
        reply(bookings)
    })

}

function getFreeDrivers(request,reply){
    var freeDrivers=[];

    var sql='select * from drivers';
    db.query(sql,function(err,drivers){
 
        if(err) throw boom.boomify();
        for(var driver of drivers){
            if(driver.status==1){
                var freeDriver={

                }
                freeDriver.id=driver.id;
                freeDriver.name=driver.name;
                freeDriver.email=driver.email;
                freeDriver.address=driver.address;
                freeDriver.status=driver.status;
                freeDrivers.push(freeDriver);
            }
        }
        reply(freeDrivers);

    })
}

function assignDrivers(request,reply){

    var booking_id=request.params.booking_id;
  
    var sql=`select  * from booking where id=${booking_id}`;
    db.query(sql,function(err,result){
        
        console.log(result);
        if(result.length==0){
            
            reply({
                status:400,
                message:"Ride with given id is not valid"
            });

        }else{
             //console.log("we are inside else block")
          // Creating Polygen and then check the latitude and the longtude that it is present or not inside the polygen 
            var sql=`select * from booking
                 where id=${booking_id} 
                 AND 
                 Contains(
                     GeomFromText('POLYGON((0 0,0 75,75 75,75 0,0 0))'),
                     geo_location
                       )`;

                const query=db.query(sql,function(err,result){
                //if id not present it will return the empty object
                console.log(query.ErrorPacket.message);
                console.log(query.result);
                console.log(result);
                //If location is out of the area where we are providing the services
                if(result.length==0){
                    reply({
                        status:400,
                        message:"We are not providing services in your location"
                    })
                }else if(result[0].status=="assigned"){  //if driver is already assign for the ride
                    reply({
                        status:400,
                        message:"Driver already Assigned to you."
                    })
                }else{  //assign the rides
                    console.log("inside else block");

                    var sql="select * from drivers where status=1";
                    db.query(sql,function(err,freeDrivers){

                        var driver_id=freeDrivers[0].id;
                        
                        var sql1=`update drivers set status=0 where id=${driver_id}`;
                        db.query(sql1,function(err,resolve){
                            if(err) throw boom.boomify();
                        })

                        var sql2=`update booking set status="assigned",drivers_fk=${driver_id} where id=${booking_id}`;
                        db.query(sql2,function(err,resolve){
                            if(err) throw boom.boomify();
                            reply({
                                status:200,
                                message:"Driver Assigned!!!"
                            })
                        });
                  });
        
                }
            })
        
        }

    });
    
}
module.exports={
   
    adminGetBookings,
    adminGetBookingsWithUserId,
    adminGetBookingsWithDateFilter,
    getFreeDrivers,
    assignDrivers

}
