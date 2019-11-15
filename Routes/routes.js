const  Joi                          =       require('joi');
const  controllers                  =       require('../Controller/controllers');
const  driverControllers            =       require('../Controller/driverControllers');
const  adminControllers             =       require('../Controller/adminControllers');

exports.plugin={
    register:(server,options,next)=>{

        server.route({
            method:'POST',
            path:'/user/signup',
            options:{
                description:'User SignUp Api',
                notes:'signup with valid phone number',
                handler:controllers.userSignUp,
                tags:['api','user'],
                validate:{
                    
                    payload:

                            Joi.object({
                                name:Joi.string().min(3).required().trim(),
                                email:Joi.string().email().required().trim().lowercase(),
                                phone:Joi.string().regex(/^[0-9]+$/).min(10).required(),
                                password:Joi.string().min(6).required()
                            }).label('User')
                }
                
            }
        }),
        server.route({
            method:'POST',
            path:'/user/signin',
            options:{
                 description:'User SignIn Api',
                 notes:'provide valid credentials',
                 handler:controllers.userSignIn,
                 tags:['api','user']
            }
        }),
        server.route({
            method:'POST',
            path:'/user/createBooking',
            options:{
                 description:'Create Booking Api',
                 handler:controllers.userCreateBooking,
                 tags:['api','user']
            }
        }),
        server.route({
            method:'GET',
            path:'/user/getBookings',
            options:{
                description:'Get All Booking Details Api',
                handler:controllers.userGetBookings,
                tags:['api','user']
            }
        }),
        server.route({
            method:'GET',
            path:'/user/getBooking/{user_id}',
            options:{
                 description:'Filter Booking With User Id',
                 handler:controllers.userGetBookingWithId,
                 tags:['api','user']
            }
        }),
        server.route({
            method:'GET',
            path:'/user/getBooking/{from_date}/{to_date}',
            options:{
                 description:'Filter Booking Between Dates',
                 handler:controllers.userBookingWithFilteredDate,
                 tags:['api','user']
            }
        }),
        server.route({
            method:'POST',
            path:'/driver/signup',
            options:{
                 description:'Driver SignUp Api',
                 handler:driverControllers.driverSignUp,
                 tags:['api','driver'],
                 validate:{
                    
                    payload:

                            Joi.object({
                                name:Joi.string().min(3).required().trim(),
                                email:Joi.string().email().required().trim().lowercase(),
                                phone:Joi.string().regex(/^[0-9]+$/).min(10).max(10).required(),
                                dob:Joi.string().optional(),
                                address:Joi.string().optional(),
                                password:Joi.string().min(6).required()
                            }).label('Driver')
                }
            }
        }),
        server.route({
            method:'POST',
            path:'/driver/signin',
            options:{
                  description:'Driver SignIn Api',
                  handler:driverControllers.driverSignIn,
                  tags:['api','driver']
            }
        }),
        server.route({
            method:'POST',
            path:'/driver/confirmOrRejectBooking',
            options:{
                  description:'Driver Confirm Booking',
                  handler:driverControllers.driverConfirmRejectBookings,
                  tags:['api','driver']
            }
        }),
        server.route({
            method:'GET',
            path:'/admin/getBookings',
            options:{
                description:'Get Booking Api',
                handler:adminControllers.adminGetBookings,
                tags:['api','admin']
            }
        }),
        server.route({
            method:'GET',
            path:'/admin/getBookings/{user_id}',
            options:{
                 description:'Filter Booking By Id',
                 handler:adminControllers.adminGetBookingsWithUserId,
                 tags:['api','admin']
            }
        }),
        server.route({
            method:'GET',
            path:'/admin/getBookings/{from_date}/{to_date}',
            options:{
                   description:'Filter Booking By Date',
                   handler:adminControllers.adminGetBookingsWithDateFilter,
                   tags:['api','admin']
            }
        }),
        server.route({
            method:'GET',
            path:'/admin/freeDrivers',
            options:{
                    description:'Free Driver Api',
                    handler:adminControllers.getFreeDrivers,
                    tags:['api','admin']
            }
        }),
        server.route({
            method:'PUT',
            path:'/admin/assignDrivers/{booking_id}',
            options:{
                    description:'Assign Drivers Api',
                    handler:adminControllers.assignDrivers,
                    tags:['api','admin']
            }
        })

    },
    name:'api',
    version:'1.0.0'

}