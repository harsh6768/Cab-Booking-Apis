const  Joi                            =       require('joi');
const  adminController                =       require('./admin-controller');

exports.plugin={
    register:(server,options,next)=>{

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
    name:'admin api',
    version:'1.0.0'

}