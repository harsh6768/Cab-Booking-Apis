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

const server = new Hapi.Server({
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

const init=async()=>{
    //register dependencies
    await server.register([
      Inert,
      Vision,
      Good,
      {
        plugin: HapiSwagger,
        options: swaggerOptions
      }
    ]);

    await server.register(
      {
        plugin:require('./Routes/routes')
      },
      {
        routes:{prefix:'/api/v1'}
      },
      (err)=>{
        if(err){throw err }
      }
    )
    try {
      await server.start();
      console.log("Server running at:", server.info.uri);
    } catch (err) {
      console.log(err);
    }

};
init();
