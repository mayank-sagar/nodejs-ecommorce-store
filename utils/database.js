const mongoDb = require('mongodb');
const MongoClient = mongoDb.MongoClient;
_db = null;

const mongoConnect = (callback) => {
  MongoClient.connect('mongodb+srv://user:password@123@ecommerce-dphpz.mongodb.net/ecommerce?retryWrites=true&w=majority')
  .then(client => {
    console.log(client,'Connected!');
    this._db = client.db();
    callback();
  })
  .catch(err => {
    console.log('error');
    throw err;
  });
}



const getDb = () => {
if(this._db) {
  return this._db;
} else {
  throw "No Database Found";
}
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
