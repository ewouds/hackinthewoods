require('dotenv').config();
const config = {};
const debug = true;

config.host = process.env.dbendpoint || "[the endpoint URI of your Azure Cosmos DB account]";
config.authKey = process.env.dbkey || "[the PRIMARY KEY value of your Azure Cosmos DB account";
config.databaseId = "ToDoList";
config.containerId = "Items";
config.logicappurl = process.env.logicappurl;

if (debug==true) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.log(`Go to http://localhost:${process.env.PORT || '3000'} to try the sample.`);
}

module.exports = config;