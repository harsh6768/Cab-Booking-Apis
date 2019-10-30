const Hapi              =       require("hapi");
const routes            =       require("./Routes/routes");
const admin             =       require("./Model/admin");
const mongoDb           =       require("./Model/mongo.db");

// //for creating the admin
admin.createAdmin();

const port = process.env.port || 3002;
//to listen the request in localhost
const server = new Hapi.Server();

server.connection({
  port: port,
  host: "localhost",
  routes: {
    cors: true
  }
});

//server.register(logger);
//for routes
routes.forEach((route, index) => {
  server.route(route);
});

server.register(
  {
    register: require("good"),
    options: {
      ops: {
        interval: 10000
      },
      reporters: {
        console: [
          {
            module: "good-squeeze",
            name: "Squeeze",
            args: [{ log: "*", response: "*", request: "*" }]
          },
          {
            module: "good-console"
          },
          "stdout"
        ]
      }
    }
  },
  function(err) {
    if (err) {
      console.log("error", "failed to install plugins");
      throw err;
    }
    server.log("info", "plugins registered");
  }
);

//to start the server
server.start(function(err) {
  if (err) throw err;
  console.log("server running at " + server.info.uri);
});
