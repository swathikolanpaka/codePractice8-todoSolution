const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite = require("sqlite3");
const app = express();
app.use(express.json());
let db = null;
const dbPath = path.join(__dirname, "todoApplication.db");

//initialize database and server
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite.Database,
    });
    app.listen(3000, () => {
      console.log("server is running");
    });
  } catch (e) {
    console.log(`Db error:${e.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

//1 API for Returns a list of all todos whose status is 'TO DO'
app.get("/todos/", async (request, response) => {
  const { search_q = "", priority, status } = request.query;
  const ifPriorityAndStatusAvl = (requestQuery) => {
    return (
      requestQuery.priority !== undefined && requestQuery.status !== undefined
    );
  };

  const ifPriorityAvl = (requestQuery) => {
    return requestQuery.priority !== undefined;
  };

  const ifStatusAvl = (requestQuery) => {
    return requestQuery.status !== undefined;
  };

  const getTodoQuery = "";

  switch (true) {
    case ifPriorityAndStatusAvl(request.query):
      getTodoQuery = `SELECT * FROM todo WHERE todo LIKE "%${search_q}%" 
      AND priority="${priority}" 
      AND status="${status}";`;
      break;
    case ifPriorityAvl(request.query):
      getTodoQuery = `SELECT * FROM todo WHERE todo LIKE "%${search_q}" 
        AND priority="${priority}";`;
      break;
    case ifStatusAvl(request.query):
      getTodoQuery = `SELECT * FROM todo WHERE todo LIKE "${search_q}"
        AND status="${status}";`;
      break;
    default:
      getTodoQuery = `SELECT * FROM todo WHERE todo LIKE "${search_q}";`;
  }

  const data = await db.all(getTodoQuery);

  response.send(data);
});

//2 API Returns a specific todo based on the todo ID

module.exports = app;
