let fs        = require("fs");
let path      = require("path");
let Sequelize = require("sequelize");
let sequelize = null;
let db        = {};

sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, { dialect : "mysql", logging : false, host : process.env.MYSQL_HOST, options : { timezone:'+00:00' }, port : process.env.MYSQL_PORT, retry: {match: [Sequelize.ConnectionError], max: 10} });

fs.readdirSync(__dirname).filter((file) => {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
}).forEach((file) => {
    // eslint-disable-next-line
    let model = require(path.join(__dirname, file))(sequelize, Sequelize)

    db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
    if("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
