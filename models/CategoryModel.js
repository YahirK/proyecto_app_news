// models/CategoryModel.js
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    UserAlta: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    FechaAlta: {
      type: DataTypes.DATE,
      allowNull: false
    },
    UserMod: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    FechaMod: {
      type: DataTypes.DATE,
      allowNull: false
    },
    UserBaja: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    FechaBaja: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'categories',
    timestamps: true
  });

  return Category;
};