module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    additional_info: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: false
  });
  return User;
}