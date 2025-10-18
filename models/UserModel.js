// models/UserModel.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    profile_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    apellidos: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    nick: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    correo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    contraseña: {
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
      allowNull: true // Permitir nulos en la creación
    },
    FechaMod: {
      type: DataTypes.DATE,
      allowNull: true // Permitir nulos en la creación
    },
    UserBaja: {
      type: DataTypes.STRING(20),
      allowNull: true // Permitir nulos en la creación
    },
    FechaBaja: {
      type: DataTypes.DATE,
      allowNull: true // Permitir nulos en la creación
    }
  }, {
    tableName: 'users',
    freezeTableName: true,
    timestamps: true
  });

  return User;
};
