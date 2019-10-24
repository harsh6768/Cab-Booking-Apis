const bcrypt              =       require('bcrypt');
const boom                =       require('boom');
const getAge              =       require('../Utilities/dobToAgeConvert');
const db                  =       require('../Model/sql.db');

let driverSignUp=async(request,reply)=>{

    const {
        name,
        email,
        phone,
        password,
        dob,
        address
    }=request.payload;

    let age=getAge(dob);
    let hashPassword=await bcrypt.hash(password,10);

    //check whether driver with same phone number is exist or not
    var sql='select * from drivers';
    const drivers=await db.queryAsync(sql);

    //check if driver already exist
    let driverArr=drivers.filter(driver=>driver.phone===phone);

    if(driverArr.length<1){
     
        let sql='insert into drivers set ?';

        let driver={
            name,
            email,
            phone,
            password:hashPassword,
            age,
            address
        }

        //insert the data 
        db.queryAsync(sql,driver)
        .then(driver=>{
            reply({
                status:200,
                body:driver,
                message:'Driver registered successfully!!!'
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
            message:'Driver already exist with this phone number'
        })

    }

}

let driverSignIn=async(request,reply)=>{

    const {phone,password}=request.payload;
     
    let sql='select * from drivers';
    let drivers=await db.queryAsync(sql);

    //if user exist with phone number
    let driver=drivers.filter(driver=>driver.phone==phone);
    if(driver){

        console.log(driver[0].password);
        //check for password
        const isLogin=await bcrypt.compare(password,driver[0].password);  //   return true/false
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
            message:'Please enter valid phone number'
        })

    }

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