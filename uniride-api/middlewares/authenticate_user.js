const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const { isNil, isNull } = require("lodash");

module.exports = async(req, res, next) => {
    try {
        const { userId } = req.params;
        const token = req.header("Authorization");
        if (!token) {
            if (isNil(req.header("Authorization"))) {
                throw { status: 400, message: "Authorization Header is Required" };
            }
        }
        const decoded = jwt.verify(token, "jwt_secret");
        const user = await Users.findByPk(userId);
        if (isNull(user) || user.id !== decoded.user.id) {
            throw { status: 401, message: "Invalid Token" };
        }
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        return res
            .status(err.status || 500)
            .send(err.message || "Something Went Wrong!");
    }
};