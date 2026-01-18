const router = require("express").Router();
const { startExam } = require("../controllers/examController");
const validate = require("../middlewares/validate");

router.post("/:examId/start", validate(["studentDbId"]), startExam);

module.exports = router;
