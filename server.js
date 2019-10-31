const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const Good = require("@hapi/good");
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");
const routes = require("./Routes/routes");
const admin = require("./Model/admin");
const mongoDb = require("./Model/mongo.db");

// //for creating the admin
admin.createAdmin();

const port = process.env.port || 3002;

const init = async () => {
  const server = await new Hapi.Server({
    host: "localhost",
    port
  });

  //swagger documentation options
  const swaggerOptions = {
    info: {
      title: "Test API Documentation",
      version: "0.0.1"
    },

    grouping: "tags"
  };

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

  try {
    await server.start();
    console.log("Server running at:", server.info.uri);
  } catch (err) {
    console.log(err);
  }

  //routes
  server.route(routes);
};

init();
