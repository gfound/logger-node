module.exports = {
	name: process.env.LOG_NAME || 'loggerSample',
	json: process.env.LOG_JSON || false,
	level: process.env.LOG_LEVEL || 'trace',

	//输出到控制台
	stdout: process.env.LOG_STOUT || true,

	//输出到日志服务器
	service: process.env.LOG_SERVICE || false,
	serviceUrl: process.env.LOG_SERVICE_URL || '',
	
	//输出到mongodb数据库
	db: process.env.LOG_DB || true,
	dbConfig: {
		host: process.env.LOG_DB_HOST || '127.0.0.1',
		port: process.env.LOG_DB_PORT || 27017,
		user: process.env.LOG_DB_USER || '',
		password: process.env.LOG_DB_PASSWORD || '',
		database: process.env.LOG_DB_NAME || 'logs'
	}
}