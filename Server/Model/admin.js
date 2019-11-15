var db=require('./sql.db');
var bcrypt=require('bcrypt');
//env variable
require('dotenv').config();

//creating admin

var admin={
    name:process.env.ADMIN_NAME,
    email:process.env.ADMIN_EMAIL,
    phone:process.env.ADMIN_PHONE,
    password:process.env.ADMIN_PASSWORD
}
var hash=bcrypt.hashSync(admin.password,10);
admin.password=hash; 
function createAdmin(){
   
    var sql='select * from admin';
      
    db.query(sql,function(err,results){
        //to get the lenght of the data from the table
        var len=Object.keys(results).length;      
        if(len<=0){
            var sql=`insert into admin set ?`; 
            db.query(sql,admin);
            console.log('admin created');
            
        }else{
            console.log('admin already created');
        }

    });
  
}

module.exports={
    createAdmin
};

