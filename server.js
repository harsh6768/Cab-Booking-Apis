const Hapi                        =       require('@hapi/hapi');
const Inert                       =       require("@hapi/inert");
const Good                        =       require("@hapi/good");
const Vision                      =       require("@hapi/vision");
const HapiSwagger                 =       require("hapi-swagger");
const admin                       =       require("./Model/admin");
const mongoDb                     =       require("./Model/mongo.db");

// //for creating the admin
admin.createAdmin();

const port = process.env.port || 5000;

const init=async()=>{

    const server = await new Hapi.Server({
      host: "localhost",
      port
    });
    
    //swagger documentation options
    const swaggerOptions = {
      info: {
        title: "Test API Documentation",
        version: "0.0.1"
      }
    };
    //register dependencies
    await server.register([
      Inert,
      Vision,
      Good,
      {
        plugin: HapiSwagger,
        options: swaggerOptions
      },
      {
        plugin:require('./Routes/routes')
      }
    ]);
    
    try {
      await server.start();
      console.log("Server running at:", server.info.uri);
    } catch (err) {
      console.log(err);
    }

};
init();
