const Bluebird                  =      require('bluebird');
const boom                      =      require('@hapi/boom');
const db                        =      require('../Model/sql.db');
const Log                       =      require('../Model/db.logs');
const bcrypt                    =      Bluebird.promisifyAll(require('bcrypt'));
const validate                  =      require('./validateDate') //to validate the date
const jwt                       =      require('jsonwebtoken');
const keys                      =      require('../Config/keys');

let userSignUp=(request,h)=>{
    
    return new Promise((resolve,reject)=>{

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
        db.queryAsync(sql)
        .then(users=>users.filter(user=>user.phone===phone))   //check if user already exist
        .then(userArr=>{
            
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
                    return resolve(
                        h.response({
                            status:200,
                            body:user,
                            message:'User registered successfully!!!'
                        }).code(200)
                    )
                })
                .catch(err=>{
                    return reject(
                        h.response({
                            status:500,
                            body:err,
                            message:'Internal server error'
                        }).code(500)
                    )
                })
        
            }else{
        
                return resolve(
                    h.response({
                        status:400,
                        message:'User already exist with this phone number'
                    }).code(400)
                )  
            }
        })

    })
    
    
}

let userSignIn=(request,h)=>{

    return new Promise((resolve,reject)=>{  //In latest version of hapi.js we need to return promise

        const {phone,password}=request.payload;
     
        let sql='select * from users';
        db.queryAsync(sql)
        .then(users=>users.filter(user=>user.phone===phone))   //if user exist with phone number
        .then(user=>{

            if(user){

                console.log(user[0].password);
                //check for password
                bcrypt.compare(password,user[0].password)  //return true/false
                .then(isLogin=>{ //if password match 
                    console.log(`----------------------->>>>>>>>>>>>>>`,isLogin);
                    if(isLogin){
        
                        //creating jwt token
                        const auth_token=jwt.sign({id:user.id},keys.jwt.SECRET_TOKEN);
                        return resolve(
                            h.response({
                                status:200,
                                body:{
                                    auth_token
                                },
                                message:'Logged In successfully!!!'
                            }).code(200)
                        )
            
                    }else{
            
                        return resolve(
                            h.response({
                                status:400,
                                message:'Please enter valid password'
                            }).code(400)
                        ) 
                    }
            
                })
                
            }else{
                return resolve(
                    h.response({
                        status:400,
                        body:boom.boomify(),
                        message:'Please enter valid phone number'
                    }).code(400)
                ) 
            }
        
        })

    })
    
}

let userCreateBooking=(request,h)=>{

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

    const{
        from_place,
        to_place,
        date_time,
        phone,
        location
    }=request.payload;

    return new Promise((resolve,reject)=>{
        
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
            db.queryAsync(sql)
             //check if any user exist with provided phone number
            .then(users=>users.filter(user=>user.phone===phone)[0]) //getting the first user
            .then(user=>{
                    if(user){
                        //setting the user id as foreign key
                         bookingDetails.users_fk=user.id;  
                         return ('select * from admin');    
                    }
                    // throw 'User with this Phone number is not exist!'
            })
            .then(adminQuery=>db.queryAsync(adminQuery))  //To get admin
            .then(admins=>{
                 //setting admin foreign_key
                 bookingDetails.admin_fk=admins[0].id;
                 //insert booking details into the booking table
                return `INSERT INTO bookings
                    (
                        geo_location,
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
        
            })
            .then(bookingQuery=>db.queryAsync(bookingQuery)) //insert booking in booking table
            .then(booking=>resolve(
                h.response({
               
                    status:200,
                    body:booking,
                    message:"Successfully created booking"
    
                })).code(200)
            )
            .catch(err=>reject(
                h.response({
                    status:400,
                    body:err,
                    message:'Error occured!'
                }).code(400)
            ))

        }else{

            return reject(
                h.response({
                    status:400,
                    body:'Date is invalid.'
                }).code(400)
            )
        }
    })

}

let userGetBookings=(request,h)=>{
    
    return new Promise((resolve,reject)=>{

        let sql=`select users.id,users.name,users.email,users.phone ,bookings.from_place,bookings.to_place,bookings.date_time
        from bookings
        inner join users
        on bookings.users_fk=users.id`;
        
        db.queryAsync(sql)
        .then(bookings=>resolve(

            h.response({
                status:200,
                body:[bookings],
                message:'Bookings detail'
            }).code(200)
        ))
        .catch(err=>reject(

            h.response({
                status:500,
                message:err
            }).code(500)
        ))  
            
    })
      

}

let userGetBookingWithId=(request,h)=>{
    
    return new Promise((resolve,reject)=>{

        let userId=request.params.user_id;
        let sql=`select users.id,users.email,users.phone,bookings.from_place,bookings.to_place,bookings.date_time
        from bookings 
        inner join users 
        on bookings.users_fk=users.id 
        AND bookings.users_fk=?`;

        db.queryAsync(sql,userId)
        .then(booking=>resolve(
            h.response({
                status:200,
                body:booking,
                message:'Booking details'
            }).code(200)
        ))
        .catch(err=>reject(

            h.response({
                status:500,
                body:err.message,
                message:'Error occured!'
           }).code(500)

        ))
    })
    
}

let userBookingWithFilteredDate=(request,h)=>{
   
    return new Promise((resolve,reject)=>{

        let from_date=new Date(request.params.from_date);
        let to_date=new Date(request.params.to_date);

        let sql=`select users.id,users.email,users.phone,bookings.from_place,bookings.to_place,bookings.date_time
        from bookings 
        inner join users 
        on bookings.users_fk=users.id 
        AND bookings.date_time>=? AND bookings.date_time<=?`;

        db.queryAsync(sql,[from_date,to_date])
        .then(bookings=>resolve(

            h.response({
                status:200,
                body:[bookings],
                message:'Bookings details'
            }).code(200)

        ))  
        .catch(err=>reject(
            h.response({
                status:500,
                body:err.message,
                message:'Error error!'
            }).code(500)
        ))
        
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
