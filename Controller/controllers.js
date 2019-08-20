var bcrypt=require('bcrypt');
var boom=require('boom');
var db=require('../Model/sql.db');
var Log=require('../Model/db.logs');

var validate=require('./validateDate'); //to validate the date

function defaultPage(request,reply){
    reply('Welcome Page');
}

function userSignUp(request,reply){
    
    var data=request.payload;
    var name=data.name;
    var email=data.email;
    var mobileNo=(data.mobile_no).toString();
    var password=data.password;
   
    //console.log(mobileNo);
    //to encrypt the password
    var hash=bcrypt.hashSync(password,10);

    var count=0;
    var sql1='select * from users';
    db.query(sql1,function(err,users){
         
        for(var user of users){
            if(user.phone==mobileNo){
                count+=1;
            }
        }
        //if user already 
        //if mobile not present
        if(count<1){
            var sql='insert into users set ?';
            var user={
                name:name,email:email,phone:mobileNo,password:hash
            }
        
            db.query(sql,user,function(err,result){
                 
                if(err) throw boom.boomify();
               
                reply({status:200,body:{name,email,mobileNo,hash},message:"SignUp successfully"});
                
            });
        
        }else{
            reply({message:"User with this mobile number is already present"});
        }
    });
    
}

function userSignIn(request,reply){
    var data=request.payload;
    var mobileNo=data.mobile_no;
    var password=data.password;
     
   var count=0;
   var sql='select * from users';
   db.query(sql,function(err,users){
      
       for(var user of users){

           if(user.phone==mobileNo){

            //to compare the password
             bcrypt.compare(password,user.password,function(err,resolve){
                  
                  if(resolve){
                    reply({status:200,message:"Logged In successfully"});
                  }else{
                   reply({message:"Password is incorrect"})
                  }
                 
             });
           }
           //reply({message:"Phone Number  is incorrect"})
       }
    
   });


}
function userCreateBooking(request,reply){

   // console.log(request.server.info);
  // console.log(request.server.info);

    var id=request.server.info.id;
    var uri=request.server.info.uri;
    var end_point=request.url.path;
    var ip=request.server.info.address;
    var method=request.method;
    var started_time=(request.server.info.started).toString();
    var created_time=(request.server.info.created).toString();
    //console.log(request.info);
    //console.log(request.headers);

    var data=request.payload;
    var fromPlace=data.from_place;
    var toPlace=data.to_place;
    var uDate=data.date_time;
    var phone=data.phone;
    var location=data.location.split(',');
    var lat=parseFloat(location[0]);
    var lng=parseFloat(location[1]);

    // //to validate the date
   // console.log(data);
    var isValid=validate(uDate);

    if(isValid){
        //console.log(isValid);
        var log=new Log({
            id:id,
            uri:uri,
            end_point:end_point,
            ip:ip,
            method:method,
            started_time:started_time,
            created_time:created_time
        })
       //to save the data into the mongodb database
        log.save(function(err,log){
             
            if(err) throw err;
        });

        var bookingDetails={
            from_place:fromPlace,
            to_place:toPlace,
            date_time:uDate,
            users_fk:null,
            admin_fk:null,

        }
        //checking is user is present or not
        var sql1='select * from users';
        db.query(sql1,function(err,users){
             
            for(var user of users){
                
                if(user.phone==phone){
                    
                    bookingDetails.users_fk=user.id;
                    var id=user.id;
                    //if user not registered simply return the message 
                    if(bookingDetails.users_fk!=null){
            
                        var adminSql='select * from admin';
                        db.query(adminSql,function(err,admins){
 
                            for(var admin of admins){

                                var admin_id=admin.id;
                                bookingDetails.admin_fk=admin.id;
                                
                                var sql="INSERT INTO booking (from_place,to_place,date_time,geo_location,users_fk,admin_fk) values (?,?,?,ST_GeomFromText('POINT(? ?)'),?,?)";
                                const query = db.query(sql,[fromPlace,toPlace,uDate,lat,lng,id,admin_id],function(err,resolve){
                                    if(resolve){
                                        
                                        reply({status:200,body:bookingDetails,message:"Successfully created booking"});
                                        return;
                                    }
                                    else throw boom.boomify();
                                });
                             }

                        });
                    }else{
                        
                        reply({status:400,message:"User not registered"});
                    
                    }
                }
                      
            }
        
        
     });

    }else{
        var log=new Log({
            id,uri,end_point,ip,method,started_time,created_time
        })
      //to save the data into the mongodb database
        log.save();
        reply({message:'Date or Time is invalid'});
    }
      
}
function userGetBookings(request,reply){
    
    //console.log(reply);
    
    var sql=`select users.name,users.email,users.phone ,booking.from_place,booking.to_place,booking.date_time
     from booking
     inner join users
     on booking.users_fk=users.id`;
     db.query(sql,function(err,bookings){
        if(err) throw boom.boomify();
        reply(bookings);
     });
     

}

function userGetBookingWithId(request,reply){
    
    //console.log(request);
    var userId=request.params.user_id;
    //console.log(userId);
    var sql=`select users.id,users.email,users.phone,booking.from_place,booking.to_place,booking.date_time
       from booking 
       inner join users 
       on booking.users_fk=users.id 
       AND booking.users_fk=?`;

    db.query(sql,userId,function(err,bookings){
        if(err) throw boom.boomify();
        reply(bookings);
    });

}

function userBookingWithFilteredDate(request,reply){
   
    
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

module.exports={
    defaultPage,
    userSignUp,
    userSignIn,
    userCreateBooking,
    userGetBookings,
    userGetBookingWithId,
    userBookingWithFilteredDate
}
