const { getPagination, getPagingData, getOrder } = require('../../utils/queryUtils');
const { Op } = require('@sequelize/core');
const { exists } = require('../../utils/utils');


module.exports = app => {
  const { cursosTable } = require('../../models/dbTables');
  const controller = {};

  controller.getAll = (req, res) => {
    const where = { [Op.and]: [] };

    if (exists(req.query.description)) where.description = { [Op.like]: `%${req.query.description}%` };
    if (exists(req.query.curseId)) where.curseId = { [Op.like]: req.query.curseId }

    const order = getOrder(req.query.field, req.query.order);
    const filters = { where, order, ...getPagination(req.query.page, req.query.size) }

    cursosTable.findAndCountAll(filters).then((response) => {
      res.status(200).json(getPagingData(response, req.query.page, req.query.size));
    }).catch(err => {
      console.log("ERROR...:", err);
      res.status(500).json({ error: 'Ocorreu um erro ao buscar a lista de cursos' })
    })
  };

  controller.getShort = (req, res) => {
    const where = { [Op.and]: [] };

    if (exists(req.query.type)) where.type = { [Op.like]: req.query.type }

    const order = getOrder(req.query.field, req.query.order);
    const filters = { where, order, }

    cursosTable.findAll(filters).then((response) => {
      res.status(200).json(response);
    }).catch(err => {
      console.log("ERROR...:", err);
      res.status(500).json({ error: 'Ocorreu um erro ao buscar a lista de cursos' })
    })
  };

  controller.insert = (req, res) => {
    const body = { ...req.body };

    cursosTable.create(body).then((response) => {
      res.status(200).json({ type: response.type });
    }).catch(err => {
      console.log("ERROR...:", err);
      res.status(500).json({ error: 'Ocorreu um erro ao inserir o curso' })
    })
  };

  controller.update = (req, res) => {
    const body = { ...req.body };
    const seqQuery = { where: { id: req.params.id } }

    cursosTable.update(body, seqQuery).then(() => {
      res.status(200).json(true);
    }).catch(err => {
      console.log("ERROR...:", err);
      res.status(500).json({ error: 'Ocorreu um erro ao atualizar o curso' })
    })
  };

  controller.delete = (req, res) => {
    const seqQuery = { where: { id: req.params.id } }
    cursosTable.destroy(seqQuery).then(() => {
      res.status(200).json(true);
    }).catch(err => {
      console.log("ERROR...:", err);
      res.status(500).json({ error: 'Ocorreu um erro ao excluir o curso' })
    })
  };

  return controller;
}