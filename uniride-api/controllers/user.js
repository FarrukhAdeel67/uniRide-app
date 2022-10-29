const { Users, sequelize } = require("../models");
const config = require("../config");
const CryptoJS = require("crypto-js");

module.exports = {
  signUp: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { name, phoneNumber, password } = req.body;
      const encryptingPassword = CryptoJS.AES.encrypt(
        password,
        config.get("pass_secret")
      ).toString();
      if (!name || !phoneNumber || !password) {
        throw { status: 400, message: "Required fields cannot be empty." };
      }
      const phoneNumberFound = await Users.findOne({
        where: {
          phoneNumber: phoneNumber,
        },
        transaction,
      });
      if (phoneNumberFound) {
        throw { status: 409, message: "Phone Number already exists." };
      }
      let user = await Users.create(
        {
          name: name,
          phoneNumber: phoneNumber,
          password: encryptingPassword,
        },
        {
          transaction,
        }
      );
      await transaction.commit();
      res.status(200).send({ user });
    } catch (err) {
      console.log(err);
      await transaction.rollback();
      return res
        .status(err.status || 500)
        .send(err.message || "Something went wrong...");
    }
  },

  logIn: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { phoneNumber, password } = req.body;
      if (!phoneNumber || !password) {
        throw { status: 400, message: "Required feilds cannot be empty" };
      }

      let user = await Users.findOne(
        {
          where: { phoneNumber: phoneNumber },
        },
        transaction
      );
      if (!user) {
        throw { status: 404, message: "User doesn't exist" };
      }
      const decryptPassword = CryptoJS.AES.decrypt(
        user.password,
        config.get("pass_secret")
      ).toString(CryptoJS.enc.Utf8);
      console.log(decryptPassword);
      console.log(password);
      if (decryptPassword !== password) {
        throw { status: 400, message: "Wrong credentials!" };
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
