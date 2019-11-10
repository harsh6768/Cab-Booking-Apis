const Bluebird              =   require('bluebird');
const boom                  =   require('boom');
const db                    =   require('../Model/sql.db');
const Log                   =   require('../Model/db.logs');
const bcrypt                =   Bluebird.promisifyAll(require('bcrypt'));
const validate              =   require('../Controller/validateDate'); //to validate the date

let userSignUp=async(request,reply)=>{
    
    console.log(request.payload);
    
    const {
        name,
        email,
        phone,
        password
    }=request.payload;
   
    //to encrypt the password
    let hash=bcrypt.hashSync(password,10);

    let sql='select * from users';
    const users=await db.queryAsync(sql);

    //check if user already exist
    let userArr=users.filter(user=>{
        return user.phone===phone;
    });

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
            // console.log(user);
            //setting the user id as foreign key
            bookingDetails.users_fk=user.id;

            let sql='select * from admin';
            let admin=await db.queryAsync(sql);
            //setting admin foreign_key
            bookingDetails.admin_fk=admin[0].id;
        
            // //insert booking details into the booking table
            let sql1=`INSERT INTO bookings
             (geo_location,
                from_place,
                to_place,
                date_time,
                users_fk,
                admin_fk
             )
              values 
              (
                  ST_GeomFromText('POINT(${lat} ${lng})'),
                  '${from_place}',
                  '${to_place}',
                  '${date_time}',
                  ${bookingDetails.users_fk},
                  ${bookingDetails.admin_fk}
              )`;
            
            db.queryAsync(sql1)
            .then(booking=>{
                console.log(`-------------------------------`)
                console.log(booking);

                reply({
                    status:200,
                    body:booking,
                    message:"Successfully created booking"
                });
            })
            .catch(err=>{

                reply({
                    status:500,
                    message:'internal server error'
                })
            })

        }else{

            reply({
                status:400,
                message:'User does not exist '
            })
        }

    }
}
let userGetBookings=(request,reply)=>{
    
    
    var sql=`select users.id,users.name,users.email,users.phone ,bookings.from_place,bookings.to_place,bookings.date_time
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

function userGetBookingWithId(request,reply){
    
    let userId=request.params.user_id;
    let sql=`select users.id,users.email,users.phone,bookings.from_place,bookings.to_place,bookings.date_time
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

let userBookingWithFilteredDate=(request,reply)=>{
   
    
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

module.exports={
    userSignUp,
    userSignIn,
    userCreateBooking,
    userGetBookings,
    userGetBookingWithId,
    userBookingWithFilteredDate
}
