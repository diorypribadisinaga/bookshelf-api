const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async ()=>{
  const server = new Hapi.Server({
    port : process.env.PORT || 9000,
    host: process.env.NODE_ENV !== 'production'  ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*']
      }
    }
  });

  server.route(routes);

  await server.start();
  return server.info.uri;
};

init()
  .then((uri)=>{
    console.info(`Server started on ${  uri}`);
  });
