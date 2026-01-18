const router = require("express").Router();
const { loginStudent } = require("../controllers/studentController");
const validate = require("../middlewares/validate");

router.post("/login", validate(["studentId"]), loginStudent);

module.exports = router;
