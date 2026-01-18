const db = require("../db/db");

function startExam(req, res, next) {
  try {
    const { examId } = req.params;
    const { studentDbId } = req.body;

    const exam = db.prepare("SELECT * FROM exams WHERE id = ?").get(examId);
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    const findSession = db.prepare(
      "SELECT * FROM exam_sessions WHERE student_id = ? AND exam_id = ?"
    );
    let session = findSession.get(studentDbId, examId);

    if (!session) {
      const insert = db.prepare(
        "INSERT INTO exam_sessions (student_id, exam_id) VALUES (?, ?)"
      );
      const info = insert.run(studentDbId, examId);
      session = db.prepare("SELECT * FROM exam_sessions WHERE id = ?").get(info.lastInsertRowid);
    }

    res.status(200).json({ message: "Exam session started", session });
  } catch (err) {
    next(err);
  }
}

function adminSeed(req, res, next) {
  try {
    const insertExam = db.prepare(
      "INSERT INTO exams (title, start_time, end_time) VALUES (?, ?, ?)"
    );
    const insertQuestion = db.prepare(
      "INSERT INTO questions (exam_id, text, type, options, answer_key) VALUES (?, ?, ?, ?, ?)"
    );

    const transaction = db.transaction(() => {
      const examInfo = insertExam.run(
        "Sample Exam",
        new Date().toISOString(),
        null
      );
      const examId = examInfo.lastInsertRowid;

      const sampleQuestions = [
        {
          text: "What is 2 + 2?",
          type: "mcq",
          options: ["1", "2", "3", "4"],
          answer_key: "4",
        },
        {
          text: "Capital of India?",
          type: "mcq",
          options: ["Delhi", "Mumbai", "Pune", "Chennai"],
          answer_key: "Delhi",
        },
        {
          text: "Which is a JavaScript runtime?",
          type: "mcq",
          options: ["Node.js", "Django", "Laravel", "Rails"],
          answer_key: "Node.js",
        },
        {
          text: "HTTP status for success?",
          type: "mcq",
          options: ["200", "404", "500", "301"],
          answer_key: "200",
        },
        {
          text: "SQL stands for?",
          type: "mcq",
          options: [
            "Structured Query Language",
            "Simple Query Language",
            "Sequential Query Language",
            "Standard Query List",
          ],
          answer_key: "Structured Query Language",
        },
      ];

      for (const q of sampleQuestions) {
        insertQuestion.run(
          examId,
          q.text,
          q.type,
          JSON.stringify(q.options),
          q.answer_key
        );
      }

      return db.prepare("SELECT * FROM exams WHERE id = ?").get(examId);
    });

    const exam = transaction();
    const questions = db.prepare("SELECT * FROM questions WHERE exam_id = ?").all(exam.id);

    res.status(201).json({ message: "Seeded sample exam", exam, questions });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  startExam,
  adminSeed,
};
