
function validate(userDate){

    var arr=userDate.split('T');
    var date=arr[0];
    var time=arr[1];
    var uDate=date.split('-')||date.split('/');
    var uTime=time.split(':');
    //console.log(uDate);
    //console.log(uTime);
    
    //date enterd by the user in UTC
    var bookingDate=new Date(uDate[0],uDate[1]-1,uDate[2],uTime[0],uTime[1],0);
    //console.log(bookingDate);
    //returns time in UTC
    var sDate=new Date();
    //console.log(sDate);
    
    //compare date and time
    if(bookingDate.valueOf()>=sDate.valueOf()) return true;
    else return false;

}
module.exports=validate;