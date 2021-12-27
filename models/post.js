'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
            Post.hasMany(models.image, {
        foreignKey: 'image_id',
        as: "image"
      })
    }
    
  };
  Post.init({
    name: DataTypes.TEXT,
    title: DataTypes.TEXT,
    price: DataTypes.TEXT,
    content: DataTypes.TEXT,
    phone: DataTypes.TEXT,
    address: DataTypes.TEXT,
    area: DataTypes.TEXT,
    location: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};