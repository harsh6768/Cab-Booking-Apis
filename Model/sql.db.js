var MYSQL=require('mysql');
//creating the mysql connection
var db= MYSQL.createConnection({
    host:"localhost",
    user:"root",
    password:"786Hh@786",
    database:"uber_test",
});
//connecting the server
db.connect(function(err){
     if(err) throw err
     console.log("mysql connected to user")
});

module.exports=db;