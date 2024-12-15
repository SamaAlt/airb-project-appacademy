'use strict';

const { Model, DataTypes } = require('sequelize');
const validator = require('validator');  // Import validator

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // Define associations here
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [4, 30],
            msg: 'Username must be between 4 and 30 characters'
          },
          isNotEmail(value) {
            if (validator.isEmail(value)) {
              throw new Error('Username cannot be an email address');
            }
          }
        }
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [3, 256],
            msg: 'Email must be between 3 and 256 characters'
          },
          isEmail: {
            msg: 'Email must be a valid email address'
          }
        }
      },

      hashedPassword: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [60, 60],
            msg: 'Password must be 60 characters long'
          }
        }
      }
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};
