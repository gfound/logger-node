module.exports = {
	name: process.env.LOG_NAME || 'logger-sample',

	loggerService: process.env.LOGGER_SERVICE || '',

	stdout: process.env.LOG_STOUT || true,
	json: process.env.LOG_JSON || false,
	level: process.env.LOG_LEVEL || 'trace'
}