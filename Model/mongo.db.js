var mongoose=require('mongoose');

mongoose.connect('mongodb://localhost/usersDb',{ useNewUrlParser: true});

let db=mongoose.connection;

//check for the connection
db.once('open',()=>{
    console.log('Connected to MongoDB');
});

//check for the error
db.on('error',(err)=>{
    console.log(err);
});
