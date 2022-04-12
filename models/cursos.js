const Sequelize = require('sequelize');

const cursos = {
  name: 'cursos',
  columns: {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }
}

module.exports = cursos;