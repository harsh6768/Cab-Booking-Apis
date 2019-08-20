var bcrypt=require('bcrypt');
var boom=require('boom');
//var XMLHttpRequest=require('xmlhttprequest').XMLHttpRequest;
var getAge=require('../Controller/dobToAgeConvert');
var db=require('../Model/sql.db');

function driverSignUp(request,reply){


    var data=request.payload;
    var name=data.name;
    var email=data.email;
    var mobileNo=(data.mobile_no).toString();
    var password=data.password;
    var dob=data.dob;
    var address=data.address;

    //convert into dob to age
    var age=getAge(dob);
    //to encrypt the password
    var hash=bcrypt.hashSync(password,10);

    var count=0;
    //check whether driver with same phone number is exist or not
    var sql1='select * from drivers';
    db.query(sql1,function(err,drivers){
         
        for(var driver of drivers){
            if(driver.phone==mobileNo){
                count+=1;
            }
        }
        //if user already 
        //if mobile not present
        if(count<1){
            var sql='insert into drivers set ?';
            var user={
                name:name,email:email,phone:mobileNo,age:age,address:address,password:hash
            }
        
            db.query(sql,user,function(err,result){
                 
                if(err) throw boom.boomify();
               
                reply({status:200,body:{name,email,mobileNo,hash},message:"SignUp successfully"});
                
            });
        
        }else{
            reply({status:400,message:"Driver with this mobile number is already present"});
        }
    });

}

function driverSignIn(request,reply){


    var data=request.payload;
    var mobileNo=data.mobile_no;
    var password=data.password;
     
   var count=0;
   var sql='select * from drivers';
   db.query(sql,function(err,drivers){
      
       for(var driver of drivers){

           if(driver.phone==mobileNo){

            //to compare the password
             bcrypt.compare(password,driver.password,function(err,resolve){
                  
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

function driverConfirmRejectBookings(request,reply){

    
   //var api="https://maps.googleapis.com/maps/api/geocode/json?address=satna&key=AIzaSyAfZlz-TFPMkOjQJNNAGDqDdNeXS8KkZlM";
   
//    const Http = new XMLHttpRequest();
//    const url='https://jsonplaceholder.typicode.com/posts';
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