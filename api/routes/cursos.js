module.exports = app => {
  const controller = app.controllers.cursos;

  app.route('/curso/all').get(controller.getAll);
  app.route('/curso/short').get(controller.getShort);
  app.route('/curso').post(controller.insert);
  app.route('/curso/:id').put(controller.update);
  app.route('/curso/:id').delete(controller.delete);
}