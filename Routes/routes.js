var controllers=require('../Controller/controllers');
var driverControllers=require('../Controller/driverControllers');
var adminControllers=require('../Controller/adminControllers');

exports.plugin={
    register:(server,options,next)=>{

        server.route({
            method:'POST',
            path:'/user/signup',
            options:{
                description:'User SignUp Api',
                notes:'signup with valid phone number',
                handler:controllers.userSignUp,
                tags:['api']
            }
        }),
        server.route({
            method:'POST',
            path:'/user/signin',
            options:{
                 description:'User SignIn Api',
                 notes:'provide valid credentials',
                 handler:controllers.userSignIn,
                 tags:['api']
            }
        }),
        server.route({
            method:'POST',
            path:'/user/createBooking',
            options:{
                 description:'Create Booking Api',
                 handler:controllers.userCreateBooking,
                 tags:['api']
            }
        }),
        server.route({
            method:'GET',
            path:'/user/getBookings',
            options:{
                description:'Get All Booking Details Api',
                handler:controllers.userGetBookings,
                tags:['api']
            }
        }),
        server.route({
            method:'GET',
            path:'/user/getBooking/{user_id}',
            options:{
                 description:'Filter Booking With User Id',
                 handler:controllers.userGetBookingWithId,
                 tags:['api']
            }
        }),
        server.route({
            method:'GET',
            path:'/user/getBooking/{from_date}/{to_date}',
            options:{
                 description:'Filter Booking Between Dates',
                 handler:controllers.userBookingWithFilteredDate,
                 tags:['api']
            }
        }),
        server.route({
            method:'POST',
            path:'/driver/signup',
            options:{
                 description:'Driver SignUp Api',
                 handler:driverControllers.driverSignUp,
                 tags:['api']
            }
        }),
        server.route({
            method:'POST',
            path:'/driver/signin',
            options:{
                  description:'Driver SignIn Api',
                  handler:driverControllers.driverSignIn,
                  tags:['api']
            }
        }),
        server.route({
            method:'POST',
            path:'/driver/confirmOrRejectBooking',
            options:{
                  description:'Driver Confirm Booking',
                  handler:driverControllers.driverConfirmRejectBookings,
                  tags:['api']
            }
        }),
        server.route({
            method:'GET',
            path:'/admin/getBookings',
            options:{
                description:'Get Booking Api',
                handler:adminControllers.adminGetBookings,
                tags:['api']
            }
        }),
        server.route({
            method:'GET',
            path:'/admin/getBookings/{user_id}',
            options:{
                 description:'Filter Booking By Id',
                 handler:adminControllers.adminGetBookingsWithUserId,
                 tags:['api']
            }
        }),
        server.route({
            method:'GET',
            path:'/admin/getBookings/{from_date}/{to_date}',
            options:{
                   description:'Filter Booking By Date',
                   handler:adminControllers.adminGetBookingsWithDateFilter,
                   tags:['api']
            }
        }),
        server.route({
            method:'GET',
            path:'/admin/freeDrivers',
            options:{
                    description:'Free Driver Api',
                    handler:adminControllers.getFreeDrivers,
                    tags:['api']
            }
        }),
        server.route({
            method:'PUT',
            path:'/admin/assignDrivers/{booking_id}',
            options:{
                    description:'Assign Drivers Api',
                    handler:adminControllers.assignDrivers,
                    tags:['api']
            }
        })

    },
    name:'api',
    version:'1.0.0'

}