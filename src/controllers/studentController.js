const db = require("../db/db");

function loginStudent(req, res, next) {
  try {
    const { studentId, name } = req.body;

    const find = db.prepare("SELECT * FROM students WHERE student_id = ?");
    let student = find.get(studentId);

    if (!student) {
      const insert = db.prepare("INSERT INTO students (student_id, name) VALUES (?, ?)");
      const info = insert.run(studentId, name || null);
      student = db.prepare("SELECT * FROM students WHERE id = ?").get(info.lastInsertRowid);
    }

    res.status(200).json({ message: "Login success", student });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  loginStudent,
};
