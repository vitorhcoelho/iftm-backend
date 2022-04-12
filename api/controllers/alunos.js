const { getPagination, getPagingData, getOrder } = require('../../utils/queryUtils');
const { Op } = require('@sequelize/core');
const { exists } = require('../../utils/utils');


module.exports = app => {
  const { alunosTable, cursosTable } = require('../../models/dbTables');
  const controller = {};

  // Get all products list
  controller.getAll = (req, res) => {
    const where = { [Op.and]: [] };

    if (exists(req.query.name)) where.name = { [Op.like]: `%${req.query.name}%` };
    if (exists(req.query.description)) where.address = { [Op.like]: `%${req.query.address}%` };
    if (exists(req.query.description)) where.email = { [Op.like]: `%${req.query.email}%` };
    if (exists(req.query.typeId)) where[Op.and].push({ curseId: req.query.curseId });

    // Mesmo que inner join (com required true), se for false seria um left join (porque ai pegaria os valores da tabela de produtos, que nao tivessem relação com tipos)
    // o campo attributes, é para especificar qual campo especifico da tabela que foi definida no 'model' que voce quer que traz
    const include = [
      { model: cursosTable, required: true, attributes: ["id", "description"] }
    ]

    // Oder field must be ASC or DESC
    const order = getOrder(req.query.field, req.query.order);
    const filters = { where, include, order, ...getPagination(req.query.page, req.query.size) }

    alunosTable.findAndCountAll(filters).then((response) => {
      res.status(200).json(getPagingData(response, req.query.page, req.query.size));
    }).catch(err => {
      console.log("ERROR...:", err);
      res.status(500).json({ error: 'Ocorreu um erro ao buscar a lista de produtos' })
    })
  };

  controller.getAllShort = (req, res) => {
    const fieldsToSelect = { attributes: ["id", "name", "address", "email", "curseId"] }
    alunosTable.findAll(fieldsToSelect).then((response) => {
      res.status(200).json(response);
    }).catch(err => {
      console.log("ERROR...:", err);
      res.status(500).json({ error: 'Ocorreu um erro ao buscar a lista de produtos' })
    })
  };

  // Get product by id
  controller.getById = (req, res) => {
    const seqQuery = { where: { id: req.params.id } }
    alunosTable.findAll(seqQuery).then((response) => {
      res.status(200).json(response);
    }).catch(err => {
      console.log("ERROR...:", err);
      res.status(500).json({ error: 'Ocorreu ao buscar o produto pelo id' })
    })
  };

  // Insert new product
  controller.insert = (req, res) => {
    const body = { ...req.body };

    alunosTable.create(body).then((response) => {
      res.status(200).json({ name: response.name, address: response.address });
    }).catch(err => {
      console.log("ERROR...:", err);
      res.status(500).json({ error: 'Ocorreu um erro ao inserir o produto' })
    })
  };

  // Update product
  controller.update = (req, res) => {
    const body = { ...req.body };
    const seqQuery = { where: { id: req.params.id } }

    alunosTable.update(body, seqQuery).then(() => {
      res.status(200).json(true);
    }).catch(err => {
      console.log("ERROR...:", err);
      res.status(500).json({ error: 'Ocorreu um erro ao atualizar o produto' })
    })
  };

  // Delete product
  controller.delete = (req, res) => {
    const seqQuery = { where: { id: req.params.id } }
    alunosTable.destroy(seqQuery).then(() => {
      res.status(200).json(true);
    }).catch(err => {
      console.log("ERROR...:", err);
      res.status(500).json({ error: 'Ocorreu um erro ao excluir o produto' })
    })
  };

  return controller;
}