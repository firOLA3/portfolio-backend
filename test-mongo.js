const mongoose = require('mongoose');

const uri = "mongodb://firola3falcon_db_user:olNKnR6WbeWzjKDo@ac-ax0ozmp-shard-00-00.orjid83.mongodb.net:27017,ac-ax0ozmp-shard-00-01.orjid83.mongodb.net:27017,ac-ax0ozmp-shard-00-02.orjid83.mongodb.net:27017/?ssl=true&replicaSet=atlas-qaskv4-shard-0&authSource=admin&appName=Cluster0";

mongoose.connect(uri)
  .then(() => {
    console.log("Connected successfully using standard connection string!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection error:", err);
    process.exit(1);
  });
