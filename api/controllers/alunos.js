const { getPagination, getPagingData, getOrder } = require('../../utils/queryUtils');
const { Op } = require('@sequelize/core');
const { exists } = require('../../utils/utils');
const alunos = require('../routes/alunos');


module.exports = app => {
  const { alunosTable, cursosTable } = require('../../models/dbTables');
  const controller = {};

  controller.getAll = (req, res) => {
    const where = { [Op.and]: [] };

    if (exists(req.query.name)) where.name = { [Op.like]: `%${req.query.name}%` };
    if (exists(req.query.address)) where.address = { [Op.like]: `%${req.query.address}%` };
    if (exists(req.query.email)) where.email = { [Op.like]: `%${req.query.email}%` };
    if (exists(req.query.curseId)) where[Op.and].push({ curseId: req.query.curseId });

    const include = [
      { model: cursosTable, required: true, attributes: ["id", "type", "description"] }
    ]

    const order = getOrder(req.query.field, req.query.order);
    const filters = { where, include, order, ...getPagination(req.query.page, req.query.size) }

    alunosTable.findAndCountAll(filters).then((response) => {
      res.status(200).json(getPagingData(response, req.query.page, req.query.size));
    }).catch(err => {
      console.log("ERROR...:", err);
      res.status(500).json({ error: 'Ocorreu um erro ao buscar a lista de alunos' })
    })
  };

  controller.getAllShort = (req, res) => {
    const fieldsToSelect = { attributes: ["id", "name", "address", "email", "curseId"] }
    alunosTable.findAll(fieldsToSelect).then((response) => {
      res.status(200).json(response);
    }).catch(err => {
      console.log("ERROR...:", err);
      res.status(500).json({ error: 'Ocorreu um erro ao buscar a lista de alunos' })
    })
  };

  controller.getById = (req, res) => {
    const seqQuery = { where: { id: req.params.id } }
    alunosTable.findAll(seqQuery).then((response) => {
      res.status(200).json(response);
    }).catch(err => {
      console.log("ERROR...:", err);
      res.status(500).json({ error: 'Ocorreu ao buscar o aluno pelo id' })
    })
  };

  controller.insert = (req, res) => {
    const body = { ...req.body };

    alunosTable.create(body).then((response) => {
      res.status(200).json({ name: response.name, address: response.address });
    }).catch(err => {
      console.log("ERROR...:", err);
      res.status(500).json({ error: 'Ocorreu um erro ao inserir o aluno' })
    })
  };

  controller.update = (req, res) => {
    const body = { ...req.body };
    const seqQuery = { where: { id: req.params.id } }

    alunosTable.update(body, seqQuery).then(() => {
      res.status(200).json(true);
    }).catch(err => {
      console.log("ERROR...:", err);
      res.status(500).json({ error: 'Ocorreu um erro ao atualizar o aluno' })
    })
  };

  controller.delete = (req, res) => {
    const seqQuery = { where: { id: req.params.id } }
    alunosTable.destroy(seqQuery).then(() => {
      res.status(200).json(true);
    }).catch(err => {
      console.log("ERROR...:", err);
      res.status(500).json({ error: 'Ocorreu um erro ao excluir o aluno' })
    })
  };


  controller.login = (req, res) => {
    const where = { [Op.and]: [{ email: req.body.email, password: req.body.password }] };

    alunosTable.findOne({ where }).then((response) => {
      if (response === null) {
        res.status(200).json({ error: 'Email ou senha errados, usuário não encontrado' });
        return;
      }

      res.status(200).json(response);
    }).catch(err => {
      console.log("ERROR...:", err);
      res.status(500).json({ error: 'Email ou senha errados, usuário não encontrado' })
    })
  };

  return controller;
}