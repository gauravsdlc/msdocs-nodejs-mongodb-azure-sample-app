const { version } = require('../../package.json');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Fils dev documentation',
    version
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT}/v1`,
    },
  ],
};

module.exports = swaggerDef;
