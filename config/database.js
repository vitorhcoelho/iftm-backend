const Sequelize = require('sequelize');
const sequelize = new Sequelize('iftm', 'root', 'asdf1234',
  {
    dialect: 'mysql', host: 'localhost', port: 3306
  });

module.exports = sequelize;