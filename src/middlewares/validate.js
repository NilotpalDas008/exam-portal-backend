function validate(requiredFields = []) {
	return (req, res, next) => {
		const body = req.body || {};
		const missing = requiredFields.filter(
			(field) => body[field] === undefined || body[field] === null
		);

		if (missing.length > 0) {
			return res.status(400).json({
				error: `Missing required fields: ${missing.join(", ")}`,
			});
		}

		next();
	};
}

module.exports = validate;
