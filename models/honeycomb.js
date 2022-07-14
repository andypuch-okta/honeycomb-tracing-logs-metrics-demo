module.exports = (sequelize, DataTypes) => {
  return sequelize.define("honeycomb", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }  
  });
};