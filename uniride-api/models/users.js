"use strict";
const moment = require("moment");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("users", {
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
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category: {
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

    User.beforeCreate(async(user) => {
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(user.getDataValue("password"), salt);
        user.setDataValue("password", hashedPassword);
        user.dataValues.createdAt = moment().unix();
        user.dataValues.updatedAt = moment().unix();
    });
    User.beforeUpdate(async(user) => {
        user.dataValues.updatedAt = moment().unix();
    });

    return User;
};