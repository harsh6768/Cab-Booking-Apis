var controllers=require('../Controller/controllers');
var driverControllers=require('../Controller/driverControllers');
var adminControllers=require('../Controller/adminControllers');

var routes=[
    {
        method: 'GET',
        path: '/',
        handler:controllers.defaultPage
    },
    {
        method:'POST',
        path:'/user/signup',
        handler:controllers.userSignUp
    },
    {
        method:'POST',
        path:'/user/signin',
        handler:controllers.userSignIn
    },
    {
        method:'POST',
        path:'/user/createBooking',
        handler:controllers.userCreateBooking
    },
    {
        method:'GET',
        path:'/user/getBookings',
        handler:controllers.userGetBookings
    },
    {
        method:'GET',
        path:'/user/getBooking/{user_id}',
        handler:controllers.userGetBookingWithId
    },
    {
        method:'GET',
        path:'/user/getBooking/{from_date}/{to_date}',
        handler:controllers.userBookingWithFilteredDate
    },
    {
        method:'POST',
        path:'/driver/signup',
        handler:driverControllers.driverSignUp
    },
    {
        method:'POST',
        path:'/driver/signin',
        handler:driverControllers.driverSignIn
    },
    {
        method:'POST',
        path:'/driver/confirmOrRejectBooking',
        handler:driverControllers.driverConfirmRejectBookings
    },
    {
        method:'GET',
        path:'/admin/getBookings',
        handler:adminControllers.adminGetBookings
    },
    {
        method:'GET',
        path:'/admin/getBookings/{user_id}',
        handler:adminControllers.adminGetBookingsWithUserId
    },
    {
        method:'GET',
        path:'/admin/getBookings/{from_date}/{to_date}',
        handler:adminControllers.adminGetBookingsWithDateFilter
    },
    {
        method:'GET',
        path:'/admin/freeDrivers',
        handler:adminControllers.getFreeDrivers
    },
    {
        method:'PUT',
        path:'/admin/assignDrivers/{booking_id}',
        handler:adminControllers.assignDrivers
    }
]

module.exports=routes;