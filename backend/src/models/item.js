module.exports = (sequelize, DataTypes) => {
    const Item = sequelize.define('Item', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0
        }
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0
        }
      }
    });
  
    Item.associate = function(models) {
      Item.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'owner'
      });
    };
  
    return Item;
  };