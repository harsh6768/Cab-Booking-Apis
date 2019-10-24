const Bluebird              =   require('bluebird');
const boom                  =   require('boom');
const db                    =   require('../Model/sql.db');
const Log                   =   require('../Model/db.logs');
const bcrypt                =   Bluebird.promisifyAll(require('bcrypt'));

const validate=require('../Controller/validateDate'); //to validate the date

let userSignUp=async(request,reply)=>{
    
    console.log(request.payload);
    
    const {
        name,
        email,
        phone,
        password
    }=request.payload;
   
    //console.log(mobileNo);
    //to encrypt the password
    let hash=bcrypt.hashSync(password,10);

    let sql='select * from users';
    const users=await db.queryAsync(sql);

    //check if user already exist
    let userArr=users.filter(user=>{
        return user.phone===phone;
    });

    // console.log(userArr);

    if(userArr.length<1){
     
        let sql='insert into users set ?';

        let user={
            name,
            email,
            phone,
            password:hash
        }

        //insert the data 
        db.queryAsync(sql,user)
        .then(user=>{
            reply({
                status:200,
                body:user,
                message:'User registered successfully!!!'
            })
        })
        .catch(err=>{
            reply({
                status:500,
                body:err.message,
                message:'Internal server error'
            })
        })

    }else{

        reply({
            status:400,
            message:'User already exist with this phone number'
        })

    }

}

let userSignIn=async(request,reply)=>{

    const {phone,password}=request.payload;
     
    let sql='select * from users';
    let users=await db.queryAsync(sql);

    //if user exist with phone number
    let user=users.filter(user=>user.phone==phone);
    if(user){

        console.log(user[0].password);
        //check for password
        const isLogin=await bcrypt.compare(password,user[0].password);  //   return true/false
        if(isLogin){

           return reply({
                status:200,
                message:'Logged In successfully!!!'
            })

        }else{

            reply({
                status:400,
                message:'Please enter valid password'
            })
        }

    }else{
        reply({
            status:400,
            body:boom.boomify(),
            message:'Please enter valid phone number'
        })

    }

}

let userCreateBooking=async(request,reply)=>{

   // console.log(request.server.info);
  // console.log(request.server.info);

    let id=request.server.info.id;
    let uri=request.server.info.uri;
    let end_point=request.url.path;
    let ip=request.server.info.address;
    let method=request.method;
    let started_time=(request.server.info.started).toString();
    let created_time=(request.server.info.created).toString();
    //console.log(request.info);
    //console.log(request.headers);
    const {

        from_place,
        to_place,
        date_time,
        phone,
        location

    }=request.payload;

    console.log(request.payload);
    
    let loc=location.split(',');
    let lat=parseFloat(loc[0]);
    let lng=parseFloat(loc[1]);
    // //to validate the date
    let isValidDate=validate(date_time);

    if(isValidDate){

        console.log(`...>>>>>>>>>>>>>>>>>>>>>>>${isValidDate}`);

        let bookingDetails={
            from_place,
            to_place,
            date_time,
            phone
        }
        //get user details so that we will know that which user is actaully booking the rides
        let sql='select * from users';
        let users=await db.queryAsync(sql);

        //check if any user exist with provided phone number
        let user=users.filter(user=>user.phone==phone)[0]; //getting the first user
        
        if(user){
            console.log(user);
            //setting the user id as foreign key
            bookingDetails.users_fk=user.id;

            let sql='select * from admin';
            let admin=await db.queryAsync(sql);
            //setting admin foreign_key
            bookingDetails.admin_fk=admin[0].id;

            console.log(bookingDetails);
        
            //insert booking details into the booking table
            let sql1=`INSERT INTO bookings (from_place,to_place,date_time,geo_location,users_fk,admin_fk) values (${from_place},${to_place},${date_time},ST_GeomFromText('POINT(${lat} ${lng})'),${bookingDetails.users_fk},${bookingDetails.admin_fk})`;
            let booking=await db.queryAsync(sql1);

            if(booking){
                console.log(`-------------------------------`)
                console.log(booking);

                reply({
                    status:200,
                    body:booking,
                    message:"Successfully created booking"
                });
            }else{
                reply({
                    status:500,
                    message:'internal server error'
                })
            }
            // db.queryAsync(
            //     sql1,
            //     [from_place,to_place,date_time,phone,lat,lng,user.id,admin[0].id]
            // )
            // .then(booking=>{
            //     console.log(`-------------------------------`)
            //     console.log(booking);

            //     reply({
            //         status:200,
            //         body:booking,
            //         message:"Successfully created booking"
            //     });
            // })
            // .catch(err=>{

            //     reply({
            //         status:500,
            //         message:'internal server error'
            //     })
            // })

        }else{

            reply({
                status:400,
                message:'User does not exist '
            })
        }

    }
    // if(isValid){
    //     //console.log(isValid);
    //     let log=new Log({
    //         id:id,
    //         uri:uri,
    //         end_point:end_point,
    //         ip:ip,
    //         method:method,
    //         started_time:started_time,
    //         created_time:created_time
    //     })
    //    //to save the data into the mongodb database
    //     log.save(function(err,log){
             
    //         if(err) throw err;
    //     });

    //     let bookingDetails={
    //         from_place,
    //         to_place,
    //         date_time:uDate,
    //         users_fk:null,
    //         admin_fk:null,

    //     }
    //     //checking is user is present or not
    //     var sql1='select * from users';
        
    //     db.query(sql1,function(err,users){
             
    //         for(let user of users){
                
    //             if(user.phone==phone){
                    
    //                 bookingDetails.users_fk=user.id;
    //                 let id=user.id;
    //                 //if user not registered simply return the message 
    //                 if(bookingDetails.users_fk!=null){
            
    //                     var adminSql='select * from admin';
    //                     db.query(adminSql,function(err,admins){
 
    //                         for(let admin of admins){

    //                             let admin_id=admin.id;
    //                             bookingDetails.admin_fk=admin.id;
                                
                                // let sql="INSERT INTO booking (from_place,to_place,date_time,geo_location,users_fk,admin_fk) values (?,?,?,ST_GeomFromText('POINT(? ?)'),?,?)";
                                // const query = db.query(sql,[fromPlace,toPlace,uDate,lat,lng,id,admin_id],function(err,resolve){
                                //     if(resolve){
                                        
                                //         reply({status:200,body:bookingDetails,message:"Successfully created booking"});
                                //         return;
                                //     }
                                //     else throw boom.boomify();
                                // });
    //                          }

    //                     });
    //                 }else{
                        
    //                     reply({status:400,message:"User not registered"});
                    
    //                 }
    //             }
                      
    //         }
        
        
    //  });

    // }else{
    //     let log=new Log({
    //         id,uri,end_point,ip,method,started_time,created_time
    //     })
    //   //to save the data into the mongodb database
    //     log.save();
    //     reply({message:'Date or Time is invalid'});
    // }
      
}
let userGetBookings=(request,reply)=>{
    
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
    let userId=request.params.user_id;
    //console.log(userId);
    let sql=`select users.id,users.email,users.phone,booking.from_place,booking.to_place,booking.date_time
       from booking 
       inner join users 
       on booking.users_fk=users.id 
       AND booking.users_fk=?`;

    db.query(sql,userId,(err,bookings)=>{
        if(err) throw boom.boomify();
        reply(bookings);
    });

}

let userBookingWithFilteredDate=(request,reply)=>{
   
    
    let from_date=new Date(request.params.from_date);
    let to_date=new Date(request.params.to_date);

    let sql=`select users.id,users.email,users.phone,booking.from_place,booking.to_place,booking.date_time
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
    userSignUp,
    userSignIn,
    userCreateBooking,
    userGetBookings,
    userGetBookingWithId,
    userBookingWithFilteredDate
}
