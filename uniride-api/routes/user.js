const { Router } = require("express");
const router = Router();

// Controllers
const controller = require("../controllers/user");
const authenticateUser = require("../middlewares/authenticate_user");

router.post("/signUp", controller.signUp);
router.post("/:userId/logIn", authenticateUser, controller.logIn);

module.exports = router;
