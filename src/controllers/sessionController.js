const db = require("../db/db");

function logEvent(sessionId, type, valueObj = {}) {
  const insertEvent = db.prepare(
    "INSERT INTO telemetry_events (session_id, type, value) VALUES (?, ?, ?)"
  );
  insertEvent.run(sessionId, type, JSON.stringify(valueObj));
}

function saveResponse(req, res, next) {
  try {
    const { sessionId } = req.params;
    const { questionId, answer } = req.body;

    const session = db.prepare("SELECT * FROM exam_sessions WHERE id = ?").get(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });
    if (session.submitted_at)
      return res.status(403).json({ error: "Session already submitted" });

    const upsert = db.prepare(`
      INSERT INTO responses (session_id, question_id, answer)
      VALUES (?, ?, ?)
      ON CONFLICT(session_id, question_id)
      DO UPDATE SET answer=excluded.answer, updated_at=CURRENT_TIMESTAMP
    `);

    upsert.run(sessionId, questionId, answer);

    logEvent(sessionId, "QUESTION_SAVE", { questionId });

    res.status(200).json({ message: "Response saved" });
  } catch (err) {
    next(err);
  }
}

function updateClicks(req, res, next) {
  try {
    const { sessionId } = req.params;
    const { clicks } = req.body;

    if (typeof clicks !== "number" || Number.isNaN(clicks) || clicks < 0) {
      return res.status(400).json({ error: "clicks must be a non-negative number" });
    }

    const session = db.prepare("SELECT * FROM exam_sessions WHERE id = ?").get(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });

    const update = db.prepare(`
      UPDATE exam_sessions
      SET total_clicks = total_clicks + ?
      WHERE id = ?
    `);

    update.run(clicks, sessionId);

    logEvent(sessionId, "CLICK_UPDATE", { clicks });

    res.status(200).json({ message: "Clicks updated" });
  } catch (err) {
    next(err);
  }
}

function updateStress(req, res, next) {
  try {
    const { sessionId } = req.params;
    const { stressLevel } = req.body;

    if (
      typeof stressLevel !== "number" ||
      Number.isNaN(stressLevel) ||
      stressLevel < 1 ||
      stressLevel > 10
    ) {
      return res.status(400).json({ error: "stressLevel must be a number between 1 and 10" });
    }

    const session = db.prepare("SELECT * FROM exam_sessions WHERE id = ?").get(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });

    const update = db.prepare(`
      UPDATE exam_sessions
      SET stress_level = ?
      WHERE id = ?
    `);

    update.run(stressLevel, sessionId);

    logEvent(sessionId, "STRESS_UPDATE", { stressLevel });

    res.status(200).json({ message: "Stress level updated" });
  } catch (err) {
    next(err);
  }
}

function submitSession(req, res, next) {
  try {
    const { sessionId } = req.params;
    const { feedback } = req.body;

    const update = db.prepare(`
      UPDATE exam_sessions
      SET submitted_at = CURRENT_TIMESTAMP,
          feedback = COALESCE(?, feedback)
      WHERE id = ? AND submitted_at IS NULL
    `);

    const info = update.run(feedback || null, sessionId);

    if (info.changes === 0)
      return res.status(400).json({ error: "Session already submitted OR invalid session" });

    logEvent(sessionId, "SUBMIT", { feedback });

    res.status(200).json({ message: "Exam submitted successfully" });
  } catch (err) {
    next(err);
  }
}

function getSessionSummary(req, res, next) {
  try {
    const { sessionId } = req.params;
    const session = db.prepare(
      "SELECT id, student_id, exam_id, started_at, submitted_at, total_clicks, stress_level, feedback FROM exam_sessions WHERE id = ?"
    ).get(sessionId);

    if (!session) return res.status(404).json({ error: "Session not found" });

    res.status(200).json({ session });
  } catch (err) {
    next(err);
  }
}

function getSessionResponses(req, res, next) {
  try {
    const { sessionId } = req.params;

    const session = db.prepare("SELECT id FROM exam_sessions WHERE id = ?").get(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });

    const responses = db.prepare(
      "SELECT * FROM responses WHERE session_id = ? ORDER BY updated_at DESC"
    ).all(sessionId);

    res.status(200).json({ responses });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  saveResponse,
  updateClicks,
  updateStress,
  submitSession,
  getSessionSummary,
  getSessionResponses,
};
