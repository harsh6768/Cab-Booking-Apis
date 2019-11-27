const Bluebird           =   require('bluebird');  
const MYSQL             =   require('mysql');

let con= MYSQL.createConnection({
    host:"localhost",
    user:"root",
    password:"786Hh@786",
    database:"uber_test",
});

//connecting the server
con.connect(function(err){
     if(err) throw err
     console.log("mysql connected to user")
});

//setting db as global variable
global.db=Bluebird.promisifyAll(con);  //to convert callbacks to promise using bluebird

module.exports=db;