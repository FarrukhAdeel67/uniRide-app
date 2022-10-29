const { Users, sequelize } = require("../models");
const config = require("../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
    signUp: async(req, res) => {
        const transaction = await sequelize.transaction();
        try {
            const { name, phoneNumber, password, category } = req.body;
            if (!name || !phoneNumber || !password) {
                throw { status: 400, message: "Required fields cannot be empty." };
            }
            const phoneNumberFound = await Users.findOne({
                where: {
                    phone_number: phoneNumber,
                },
                transaction,
            });
            if (phoneNumberFound) {
                throw { status: 409, message: "Phone Number already exists." };
            }
            let user = await Users.create({
                name: name,
                phone_number: phoneNumber,
                password,
                category,
            }, {
                transaction,
            });
            user = user.toJSON();
            delete user.password;
            const token = jwt.sign({ user }, "jwt_secret");
            await transaction.commit();
            res.status(200).send({ user, token });
        } catch (err) {
            console.log(err);
            await transaction.rollback();
            return res
                .status(err.status || 500)
                .send(err.message || "Something went wrong...");
        }
    },
    logIn: async(req, res) => {
        const transaction = await sequelize.transaction();
        try {
            let { user } = req;
            console.log(user.id);
            const { phoneNumber, password } = req.body;
            if (!phoneNumber || !password) {
                throw { status: 400, message: "Required feilds cannot be empty" };
            }
            if (user.phone_number !== phoneNumber) {
                throw { status: 404, message: "wrong Phone Number" };
            }
            const hashedPassword = await bcrypt.compare(password, user.password);
            if (!hashedPassword) {
                throw { status: 400, message: "Wrong Password!" };
            }
            user = user.toJSON();
            delete user.password;
            transaction.commit();
            res.status(200).send({ user });
        } catch (err) {
            console.log(err);
            transaction.rollback();
            return res
                .status(err.status || 500)
                .send(err.message || "Something went wrong...");
        }
    },
};