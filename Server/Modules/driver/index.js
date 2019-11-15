const  Joi                            =       require('joi');
const  driverController               =       require('./driver-controller');


exports.plugin={
    register:(server,options,next)=>{

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
        })
    },
    name:'driver api',
    version:'1.0.0'

}