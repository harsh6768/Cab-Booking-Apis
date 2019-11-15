const  Joi                            =       require('joi');
const  userController                 =       require('../Controller/user-controller');
const  driverController               =       require('../Controller/driver-controller');
const  adminController                =       require('../Controller/admin-controller');

exports.plugin={
    register:(server,options,next)=>{

        server.route({
            method:'POST',
            path:'/user/signup',
            options:{
                description:'User SignUp Api',
                notes:'signup with valid phone number',
                handler:userController.userSignUp,
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
                 handler:userController.userSignIn,
                 tags:['api','user'],
                 validate:{
                     payload:{
                         phone:Joi.string().regex(/^[0-9]+$/).min(10).required(),
                         password:Joi.string().required()
                     }
                 }
            }
        }),
        server.route({
            method:'POST',
            path:'/user/createBooking',
            options:{
                 description:'Create Booking Api',
                 handler:userController.userCreateBooking,
                 tags:['api','user'],
                 validate:{
                     payload:
                        Joi.object({
                            from_place:Joi.string().required().trim(),
                            to_place:Joi.string().required().trim(),
                            location:Joi.string().required().trim(),
                            phone:Joi.string().regex(/^[0-9]+$/).min(10).required()
                        }).label('Booking')
                 }
            }
        }),
        server.route({
            method:'GET',
            path:'/user/getBookings',
            options:{
                description:'Get All Booking Details Api',
                handler:userController.userGetBookings,
                tags:['api','user']
            }
        }),
        server.route({
            method:'GET',
            path:'/user/getBooking/{user_id}',
            options:{
                 description:'Filter Booking With User Id',
                 handler:userController.userGetBookingWithId,
                 tags:['api','user'],
                 validate:{
                     params:{
                         user_id:Joi.number().required().description('user id')
                     }
                 }
            }
        }),
        server.route({
            method:'GET',
            path:'/user/getBooking/{from_date}/{to_date}',
            options:{
                 description:'Filter Booking Between Dates',
                 handler:userController.userBookingWithFilteredDate,
                 tags:['api','user'],
                 validate:{
                     params:{
                         from_date:Joi.string().required().trim().description("Starting Date Of Booking"),
                         to_date:Joi.string().required().trim().description("Ending Date of Booking")
                     }
                 }
            }
        }),
        server.route({
            method:'POST',
            path:'/driver/signup',
            options:{
                 description:'Driver SignUp Api',
                 handler:driverController.driverSignUp,
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
                  handler:driverController.driverSignIn,
                  tags:['api','driver'],
                  validate:{
                    payload:{
                        phone:Joi.string().regex(/^[0-9]+$/).min(10).required(),
                        password:Joi.string().required()
                    }
                }
            }
        }),
        server.route({
            method:'POST',
            path:'/driver/confirmOrRejectBooking',
            options:{
                  description:'Driver Confirm Booking',
                  handler:driverController.driverConfirmRejectBookings,
                  tags:['api','driver']
            }
        }),
        server.route({
            method:'GET',
            path:'/admin/getBookings',
            options:{
                description:'Get Booking Api',
                handler:adminController.adminGetBookings,
                tags:['api','admin']
            }
        }),
        server.route({
            method:'GET',
            path:'/admin/getBookings/{user_id}',
            options:{
                 description:'Filter Booking By Id',
                 handler:adminController.adminGetBookingsWithUserId,
                 tags:['api','admin'],
                 validate:{
                    params:{
                        user_id:Joi.number().required().description('user id')
                    }
                }
            }
        }),
        server.route({
            method:'GET',
            path:'/admin/getBookings/{from_date}/{to_date}',
            options:{
                   description:'Filter Booking By Date',
                   handler:adminController.adminGetBookingsWithDateFilter,
                   tags:['api','admin'],
                   validate:{
                    params:{
                        from_date:Joi.string().required().trim().description("Starting Date Of Booking"),
                        to_date:Joi.string().required().trim().description("Ending Date of Booking")
                    }
                }
            }
        }),
        server.route({
            method:'GET',
            path:'/admin/freeDrivers',
            options:{
                    description:'Free Driver Api',
                    handler:adminController.getFreeDrivers,
                    tags:['api','admin']
            }
        }),
        server.route({
            method:'PUT',
            path:'/admin/assignDrivers/{booking_id}',
            options:{
                    description:'Assign Drivers Api',
                    handler:adminController.assignDrivers,
                    tags:['api','admin'],
                    validate:{
                        params:{
                            booking_id:Joi.number().required().description('booking id')
                        }
                    }
            }
        })

    },
    name:'api',
    version:'1.0.0'

}