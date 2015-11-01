module.exports = {
	name: process.env.LOG_NAME || 'loggerSample',
	json: process.env.LOG_JSON || false,
	level: process.env.LOG_LEVEL || 'trace',

	//输出到控制台
	stdout: process.env.LOG_STOUT || true,

	//输出到Kafka
	kafka: process.env.LOG_KAFKA || true,
	kafkaUrl: process.env.LOG_KAFKA_URL || 'http://localhost:8082/topics/test',
	
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