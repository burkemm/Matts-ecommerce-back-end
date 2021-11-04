const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');

class Category extends Model {}

Category.init(
  {
  // define columns
  // Added the id that has an autoincrementing integer with no null value allowed and it's the primary key.
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  // Added category_name with a string data type and allows no null values.
  category_name: {
    type: DataTypes.STRING,
    allowNull: false
  }
},
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'category',
  }
);

module.exports = Category;