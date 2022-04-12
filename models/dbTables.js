const database = require('../config/database');
const alunos = require('./alunos');
const cursos = require('./cursos');

const alunosTable = database.define(alunos.name, alunos.columns)
const cursosTable = database.define(cursos.name, cursos.columns)
alunosTable.belongsTo(cursosTable, { onDelete: 'cascade', foreignKey: 'curseId', targetKey: 'id' })

module.exports = { alunosTable, cursosTable };