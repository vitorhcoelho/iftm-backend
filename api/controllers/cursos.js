const { getPagination, getPagingData, getOrder } = require('../../utils/queryUtils');
const { Op } = require('@sequelize/core');
const { exists } = require('../../utils/utils');


module.exports = app => {
  const { typesTable } = require('../../models/dbTables');
  const controller = {};

  // Get all types list
  controller.getAll = (req, res) => {
    const where = { [Op.and]: [] };

    if (exists(req.query.description)) where.description = { [Op.like]: `%${req.query.description}%` };
    if (exists(req.query.type)) where.type = { [Op.like]: req.query.type }

    // Oder field must be ASC or DESC
    const order = getOrder(req.query.field, req.query.order);
    const filters = { where, order, ...getPagination(req.query.page, req.query.size) }

    typesTable.findAndCountAll(filters).then((response) => {
      res.status(200).json(getPagingData(response, req.query.page, req.query.size));
    }).catch(err => {
      console.log("ERROR...:", err);
      res.status(500).json({ error: 'Ocorreu um erro ao buscar a lista de tipos' })
    })
  };

  // Get all without pagination
  controller.getShort = (req, res) => {
    const where = { [Op.and]: [] };

    if (exists(req.query.type)) where.type = { [Op.like]: req.query.type }

    // Oder field must be ASC or DESC
    const order = getOrder(req.query.field, req.query.order);
    const filters = { where, order, }

    typesTable.findAll(filters).then((response) => {
      res.status(200).json(response);
    }).catch(err => {
      console.log("ERROR...:", err);
      res.status(500).json({ error: 'Ocorreu um erro ao buscar a lista de tipos' })
    })
  };

  // Insert new type
  controller.insert = (req, res) => {
    const body = { ...req.body };

    typesTable.create(body).then((response) => {
      res.status(200).json({ type: response.type });
    }).catch(err => {
      console.log("ERROR...:", err);
      res.status(500).json({ error: 'Ocorreu um erro ao inserir o tipo' })
    })
  };

  // Update type
  controller.update = (req, res) => {
    const body = { ...req.body };
    const seqQuery = { where: { id: req.params.id } }

    typesTable.update(body, seqQuery).then(() => {
      res.status(200).json(true);
    }).catch(err => {
      console.log("ERROR...:", err);
      res.status(500).json({ error: 'Ocorreu um erro ao atualizar o tipo' })
    })
  };

  // Delete type
  controller.delete = (req, res) => {
    const seqQuery = { where: { id: req.params.id } }
    typesTable.destroy(seqQuery).then(() => {
      res.status(200).json(true);
    }).catch(err => {
      console.log("ERROR...:", err);
      res.status(500).json({ error: 'Ocorreu um erro ao excluir o tipo' })
    })
  };

  return controller;
}