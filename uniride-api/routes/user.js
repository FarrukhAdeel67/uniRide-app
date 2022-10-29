const { Router } = require("express");
const router = Router();

// Controllers
const controller = require("../controllers/user");

router.post("/signUp", controller.signUp);
router.post("/logIn", controller.logIn);

module.exports = router;
