// models/StateModel.js
module.exports = (sequelize, DataTypes) => {
  const State = sequelize.define('State', {
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
    abreviacion: {
      type: DataTypes.STRING(5),
      allowNull: false,
      unique: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    UserAlta: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    FechaAlta: {
      type: DataTypes.DATE,
      allowNull: false
    },
    UserMod: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    FechaMod: {
      type: DataTypes.DATE,
      allowNull: false
    },
    UserBaja: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    FechaBaja: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'states',
    timestamps: true
  });

  return State;
};