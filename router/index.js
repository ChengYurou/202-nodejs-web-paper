const homeworks = require('./routers/homeworks');
const sections = require('./routers/sections');
const papers = require('./routers/paper');

module.exports = (app) => {
  app.use('/homeworks', homeworks);
  app.use('/sections', sections);
  app.use('/papers', papers);
};