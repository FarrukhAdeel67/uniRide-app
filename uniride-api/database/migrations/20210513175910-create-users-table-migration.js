"use strict";

const table = "users";
const { DataTypes } = require("sequelize");

module.exports = {
  up: async function (queryInterface, DataTypes) {
    await queryInterface.createTable(table, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      catagory: {
        type: DataTypes.ENUM("Student", "Faculty", "Driver"),
        allowNull: false,
        defaultValue: "Student",
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    });
  },
  down: async function (queryInterface) {
    await queryInterface.dropTable(table);
  },
};
