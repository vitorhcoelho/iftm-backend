module.exports = app => {
  const controller = app.controllers.alunos;

  app.route('/aluno/all').get(controller.getAll);
  app.route('/aluno/short').get(controller.getAllShort);
  app.route('/aluno/detail/:id').get(controller.getById);
  app.route('/aluno').post(controller.insert);
  app.route('/aluno/:id').put(controller.update);
  app.route('/aluno/:id').delete(controller.delete);
  app.route('/login').post(controller.login);
}