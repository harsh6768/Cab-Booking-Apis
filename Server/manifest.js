const Inert                     =       require('@hapi/inert');
const Vision                    =       require('@hapi/vision');
const HapiSwagger               =       require('hapi-swagger');
const Blipp                     =       require('blipp');
const Good                      =       require("@hapi/good");
const admin                     =       require('./model/admin');

//creat admin
admin.createAdmin();

const swaggerOptions = {

    info: {
        description: 'This is a Cab Booking server',
        title: 'Cab Booking API',
        version : '0.0.1',
        contact: {
            email : 'harshchaurasiya6768@gmail.com'
        }
    },
    grouping: 'tags'

}

const manifest = {
    server: {
        port: 5000
    },
    register: {
        plugins: [
                Blipp,
                Inert,
                Vision,
                {
                    plugin:Good,
                    options: {
                        ops: {
                            interval: 1000
                        },
                        reporters: {
                            myConsoleReporter: [
                                {
                                    module: '@hapi/good-squeeze',
                                    name: 'Squeeze',
                                    args: [{ log: '*', response: '*' }]
                                    // args: [{ log: '*', response: '*', ops: '*' }]
                                },
                                {
                                    module: '@hapi/good-console'
                                },
                                'stdout'
                            ]
                        }
                    }
                },
                {
                    plugin: HapiSwagger,
                    options: swaggerOptions
                },
                {
                    plugin:require('../Server/Modules/admin/index')
                },
                {
                    plugin:require('../Server/Modules/user/index')
                },
                {
                    plugin:require('../Server/Modules/driver/index')
                }
        ],
        options: {
            once: true
        }
    }
}

module.exports=manifest;

