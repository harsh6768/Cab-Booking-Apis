const Bluebird                  =       require('bluebird')
const bcrypt                    =       Bluebird.promisifyAll(require('bcrypt'));
const boom                      =       require('@hapi/boom');
const getAge                    =       require('../../util/dobToAgeConvert');
const db                        =       require('../../model/sql.db');
const jwt                       =       require('jsonwebtoken');
const keys                      =       require('../../config/keys');

let driverSignUp=(request,h)=>{

    return new Promise((resolve,reject)=>{

        console.log(request.payload);
    
        const {
            name,
            email,
            phone,
            password,
            dob,
            address
        }=request.payload;
    
        let age=getAge(dob);
        //to encrypt the password
        let hash=bcrypt.hashSync(password,10);

        let sql='select * from drivers';
        db.queryAsync(sql)
        //check if driver already exist
        .then(drivers=>drivers.filter(driver=>driver.phone===phone))   //check if user already exist
        .then(driverArr=>{
            
            if(driverArr.length<1){
        
                let sql='insert into drivers set ?';
        
                let driver={
                    name,
                    email,
                    phone,
                    password:hash,
                    age,
                    address
                }
        
                //insert the data 
                db.queryAsync(sql,driver)
                .then(user=>{
                    return resolve(
                        h.response({
                            status:200,
                            body:user,
                            message:'Driver registered successfully!!!'
                        }).code(200)
                    )
                })
                .catch(err=>{
                    return reject(
                        h.response({
                            status:500,
                            body:err.message,
                            message:'Internal server error'
                        }).code(500)
                    )
                })
        
            }else{
        
                return resolve(
                    h.response({
                        status:400,
                        message:'Driver already exist with this phone number'
                    }).code(400)
                )  
            }
        
        })
    })
    
}

let driverSignIn=(request,h)=>{

    return new Promise((resolve,reject)=>{

        const {
            phone,
            password
        }=request.payload;

        let sql='select * from drivers';
        db.queryAsync(sql)
        .then(drivers=>drivers.filter(driver=>driver.phone==phone))
        .then(drivers=>{

            console.log(drivers)
            if(drivers.length>0){

                bcrypt.compare(password,drivers[0].password)
                .then(isLogin=>{
                    if(isLogin){

                       //creating jwt token
                       const auth_token=jwt.sign({id:drivers[0].id},keys.jwt.SECRET_TOKEN);
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
                    message:'Please enter valid phone number'
                   }).code(400)
                )
            }
        })
    })
}

let driverConfirmRejectBookings=async(request,reply)=>{

    
   //var api="https://maps.googleapis.com/maps/api/geocode/json?address=satna&key=AIzaSyAfZlz-TFPMkOjQJNNAGDqDdNeXS8KkZlM";
   
//     const Http = new XMLHttpRequest();
//     const url='https://jsonplaceholder.typicode.com/posts';
//     Http.open("GET", url);
//     Http.send();

//     Http.onreadystatechange = (e) => {
//     console.log(Http.responseText)
//     }

    //    var data=request.payload;
    //    var location=data.location.split(',');
    //    var lat=location[0];
    //    var lng=location[1];
       //var location=Point(lat,lng);

    //    console.log(location);
    //    var location1={
    //        location:data.location
    //    }

   // var sql="INSERT INTO location (loc) values (ST_GeomFromText('POINT("+"?"+" "+"?"+")'))";
     
    //    var sql=`INSERT INTO location(loc) VALUES (ST_GeomFromText('POINT(${lat} ${lng})'));`;
    //    db.query(sql,function(err,results){
               
    //        if(err) throw boom.boomify();
    //        reply({message:"Data inserted successfully"});

    //     });
    

}

module.exports={
    driverSignUp,
    driverSignIn,
    driverConfirmRejectBookings
}