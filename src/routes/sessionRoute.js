const router = require("express").Router();
const {
  saveResponse,
  updateClicks,
  updateStress,
  submitSession,
  getSessionSummary,
  getSessionResponses,
} = require("../controllers/sessionController");
const validate = require("../middlewares/validate");

router.post("/:sessionId/response", validate(["questionId", "answer"]), saveResponse);
router.post("/:sessionId/clicks", validate(["clicks"]), updateClicks);
router.post("/:sessionId/stress", validate(["stressLevel"]), updateStress);
router.post("/:sessionId/submit", validate([]), submitSession);
router.get("/:sessionId", getSessionSummary);
router.get("/:sessionId/responses", getSessionResponses);

module.exports = router;
