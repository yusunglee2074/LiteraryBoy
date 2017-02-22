"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var dbConfig = require("../config/db.json")[process.env.DB_ENV];

const sequelize = new Sequelize(dbConfig.db, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    dialect: 'postgres',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }  
});

var db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

if (dbConfig["re-init"]) {
    sequelize.sync({force:true}).then(function() {
        console.log('db sync forced');
        // TODO: add indexes
        // TODO: load dummy data
    });
} else {
    sequelize.sync().then(function() {
        console.log('db sync');
    });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
