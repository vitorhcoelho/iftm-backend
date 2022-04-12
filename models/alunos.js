const Sequelize = require('sequelize');

const alunos = {
  name: 'alunos',
  columns: {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    curseId: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }
}

module.exports = alunos;