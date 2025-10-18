// models/NewsModel.js
module.exports = (sequelize, DataTypes) => {
  const News = sequelize.define('News', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    categoria_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    estado_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    usuario_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    fecha_publicacion: {
      type: DataTypes.DATE,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    imagen: {
      type: DataTypes.TEXT('medium'),
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
      allowNull: true
    },
    FechaMod: {
      type: DataTypes.DATE,
      allowNull: true
    },
    UserBaja: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    FechaBaja: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'news',
    timestamps: true
  });

  return News;
};
