module.exports = {
	name: process.env.LOG_NAME || 'loggerSample',
	level: process.env.LOG_LEVEL || 'info',

	//输出到控制台
	stdout: process.env.LOG_STOUT || false,
	json: process.env.LOG_JSON || true,

	//输出到Kafka HTTP地址
	kafkaHTTP: process.env.LOG_KAFKA_HTTP || false,
	kafkaUrl: process.env.LOG_KAFKA_URL || 'http://localhost:8082/topics/test',

	//输出到Kafka
	kafka: process.env.LOG_KAFKA || true,
	kafkaServer: {
		host: process.env.KAFKA_HOST || '192.168.0.176',
		port: process.env.KAFKA_PORT || 9092,
		topic:process.env.KAFKA_TOPIC || 'calllog'
	},

	//输出到mongodb数据库
	db: process.env.LOG_DB || false,
	dbConfig: {
		host: process.env.LOG_DB_HOST || '127.0.0.1',
		port: process.env.LOG_DB_PORT || 27017,
		user: process.env.LOG_DB_USER || '',
		password: process.env.LOG_DB_PASSWORD || '',
		database: process.env.LOG_DB_NAME || 'logs'
	}
}
