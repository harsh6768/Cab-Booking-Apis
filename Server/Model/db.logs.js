let mongoose=require('mongoose');

let logSchema=mongoose.Schema({
 
    
    id:{
        type:String,
        required:true
    },
    uri:{
        type:String,
        required:true
    },
    ip:{
       type:String,
       required:true
    },
    end_point:{
        type:String,
        required:true
    },
    method:{
        type:String,
        required:true
    },
    started_time:{
        type:String,
        required:true
    },
    created_time:{
        type:String,
        required:true
    }

});

let Logs=module.exports=mongoose.model('logs',logSchema);