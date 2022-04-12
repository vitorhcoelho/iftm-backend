const app = require('./config/express')();
const port = app.get('port');

const database = require('./config/database');

async function createAlunosTable() {
  try {
    const resultado = await database.sync();
  } catch (error) {
    console.log(error);
  }
}

database.authenticate()
  .then(createAlunosTable)
  .catch(err => console.log("Error...:", err))


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
});