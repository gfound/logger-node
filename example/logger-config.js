module.exports = {
  name: process.env.LOG_NAME || 'loggerSample', //日志名称，建议与工程名称一致
  level: process.env.LOG_LEVEL || 'trace', //输出的日志级别, trace、debug、info、warn、error、fatal

  //输出到控制台
  stdout: process.env.LOG_STOUT || true, //是否输出到控制台
  json: process.env.LOG_JSON || false, //如果是，是否输出成JSON格式

  //上报指定日志的服务配置
  report: {
    type: process.env.LOG_KAFKA_TYPE || 'mongo', //类型有：http、kafka、mongo

    //输出到Kafka HTTP地址
    url: process.env.LOG_URL || 'http://localhost:8082/topics/test',

    //输出到Kafka
    kafkaConfig: {
      host: process.env.KAFKA_HOST || '192.168.0.176',
      port: process.env.KAFKA_PORT || 9092,
      topic: process.env.KAFKA_TOPIC || 'calllog'
    },

    //输出到mongodb数据库
    mongoConfig: {
      host: process.env.LOG_DB_HOST || '127.0.0.1', //mongodb服务器地址
      port: process.env.LOG_DB_PORT || 27017, //mongodb服务器端口
      user: process.env.LOG_DB_USER || '', //mongodb用户名
      password: process.env.LOG_DB_PASSWORD || '', //mongodb密码
      database: process.env.LOG_DB_NAME || 'logs' //mongodb数据库名
    }
  }
}
