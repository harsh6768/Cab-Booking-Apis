let  boom               =       require('boom');
let db                  =       require('../Model/sql.db');

let adminGetBookings=async(request,reply)=>{


    let sql=`select users.id,users.name,users.email,users.phone ,bookings.from_place,bookings.to_place,bookings.date_time
    from bookings
    inner join users
    on bookings.users_fk=users.id`;

   
    db.queryAsync(sql)
    .then(bookings=>reply({

       status:200,
       body:[bookings],
       message:'Bookings detail'
    }))
    .catch(err=>reply(
        {
            status:500,
            message:err.message
        })
    )
}

let adminGetBookingsWithUserId=async(request,reply)=>{

     let userId=request.params.user_id;
     let sql=`select users.id,users.name,users.email,users.phone,bookings.from_place,bookings.to_place,bookings.date_time
        from bookings
        inner join users 
        on bookings.users_fk=users.id 
        AND bookings.users_fk=?`;
 
    db.queryAsync(sql,userId)
    .then(booking=>reply({
        status:200,
        body:booking,
        message:'Booking details'
    }))
    .catch(err=>reply({
        status:500,
        body:err.message,
        message:'Error occured!'
    }))

}

let adminGetBookingsWithDateFilter=async(request,reply)=>{

    let from_date=new Date(request.params.from_date);
    let to_date=new Date(request.params.to_date);

    let sql=`select users.id,users.email,users.phone,bookings.from_place,bookings.to_place,bookings.date_time
       from bookings 
       inner join users 
       on bookings.users_fk=users.id 
       AND bookings.date_time>=? AND bookings.date_time<=?`;

    db.queryAsync(sql,[from_date,to_date])
    .then(bookings=>reply({
        status:200,
        body:[bookings],
        message:'Bookings details'
    }))  
    .catch(err=>reply({
        status:500,
        body:err.message,
        message:'Error error!'
    }))

}

let getFreeDrivers=async(request,reply)=>{
    let freeDrivers=[];

    let sql='select * from drivers';
    
    db.queryAsync(sql)
    .then(drivers=>{

        //check if driver is free or not
        let driver=drivers.filter(driver=>driver.status===1);
        freeDriver.id=driver[0].id;
        freeDriver.name=driver[0].name;
        freeDriver.email=driver[0].email;
        freeDriver.address=driver[0].address;
        freeDriver.status=driver[0].status;
        freeDrivers.push(freeDriver);

        reply({
            status:200,
            body:freeDrivers,
            message:'Free drivers'
        })

    })
    .catch(err=>reply({
        status:500,
        body:[drivers],
        message:'Driver details'
    }))

    // db.query(sql,function(err,drivers){
 
    //     if(err) throw boom.boomify();
    //     for(var driver of drivers){
    //         if(driver.status==1){
    //             var freeDriver={

    //             }
    //             freeDriver.id=driver.id;
    //             freeDriver.name=driver.name;
    //             freeDriver.email=driver.email;
    //             freeDriver.address=driver.address;
    //             freeDriver.status=driver.status;
    //             freeDrivers.push(freeDriver);
    //         }
    //     }
    //     reply(freeDrivers);

    // })
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
