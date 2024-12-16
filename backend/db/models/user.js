'use strict';

const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error('Username cannot be an email.');
            }
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: true,
        },
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 64], // Updated length validation for bcrypt hashes
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 50],
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 50],
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      defaultScope: {
        attributes: {
          exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt'],
        },
      },
      scopes: {
        withSensitiveInfo: {
          attributes: {
            include: ['email', 'createdAt', 'updatedAt'],
          },
        },
      },
    }
  );

  return User;
};
