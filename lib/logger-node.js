var bunyan = require('bunyan'),
  http = require('request'),
  mongoDriver = require('./mongoDriver'),
  Optimist = require('optimist'),
  Producer = require('../lib/kafka/Producer');

(function() {

  var root = this;
  var logCollection;

  //定义日期输出格式
  function dateFormat(time, fmt) { //author: meizz
    var o = {
      "M+": time.getMonth() + 1, //月份
      "d+": time.getDate(), //日
      "h+": time.getHours(), //小时
      "m+": time.getMinutes(), //分
      "s+": time.getSeconds(), //秒
      "q+": Math.floor((time.getMonth() + 3) / 3), //季度
      "S": time.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }

  //定义输出颜色
  var colors = {
    'bold': [1, 22],
    'italic': [3, 23],
    'underline': [4, 24],
    'inverse': [7, 27],
    'white': [37, 39],
    'grey': [90, 39],
    'black': [30, 39],
    'blue': [34, 39],
    'cyan': [36, 39],
    'green': [32, 39],
    'magenta': [35, 39],
    'red': [31, 39],
    'yellow': [33, 39]
  };

  var colorFromLevel = {
    10: 'white', // TRACE
    20: 'yellow', // DEBUG
    30: 'cyan', // INFO
    31: 'cyan', //呼叫流程跟踪
    40: 'magenta', // WARN
    50: 'red', // ERROR
    60: 'inverse', // FATAL
  };

  var nameFromLevel = {
    10: 'TRACE', // TRACE
    20: 'DEBUG', // DEBUG
    30: ' INFO', // INFO
    31: ' CALL', // 呼叫流程跟踪
    40: ' WARN', // WARN
    50: 'ERROR', // ERROR
    60: 'FATAL', // FATAL
  };

  function stylizeWithColor(str, color) {
    if (!str)
      return '';
    var codes = colors[color];
    if (codes) {
      return '\033[' + codes[0] + 'm' + str +
        '\033[' + codes[1] + 'm';
    } else {
      return str;
    }
  }

  //日志数据流处理
  function MyRawStream() {};
  MyRawStream.prototype.write = function(rec) {

    //日志打印到控制台
    if (config.stdout) {
      process.nextTick(function() {
        _stdout(rec);
      });
    }

    //如果config没有配置report，不会自动上报。只支持打印
    if (!config.report) {
      return
    }
    //如果上报内容没有report=true，不会自动上报。只支持打印
    if (!rec.report) {
      return
    }
    delete rec.report;

    if (config.report.type == 'kafka') {
      process.nextTick(function() {
        _toKafka(rec);
      });
    } else if (config.report.type == 'kafka_http') {
      process.nextTick(function() {
        _toKafkaHTTP(rec);
      });
    } else if (config.report.type == 'mongo') {
      process.nextTick(function() {
        _toMongodb(rec);
      });
    }
  }

  function _stdout(rec) {

    if (config.LOG_JSON) {

      process.stdout.write(JSON.stringify(rec) + '\n');

    } else { //打印成标准样式
      rec.time = dateFormat(rec.time, 'yyyy-MM-dd hh:mm:ss.S');

      var time = '[' + rec.time + '] ';
      var levelName = nameFromLevel[rec.level] + ': ';

      //如果是DBEUG，需要打印函数
      var func = '';
      if (rec.level <= 20) {
        var func = rec.src.func ? '[' + rec.src.func + '] ' : '[]';
      }

      var msg = stylizeWithColor(rec.msg, colorFromLevel[rec.level]);
      process.stdout.write(time + levelName + func + msg + '\n');
    }
  }

  function _toMongodb(rec) {

    if (!logCollection) {
      console.log(config.report.mongoConfig)
      mongoDriver.connect(config.report.mongoConfig);
      logCollection = mongoDriver.model(config.name);
    }

    logCollection.create(rec);
  }

  function _toKafka(rec) {

    var kafkaConfig = config.report.kafkaConfig;
    var argv = Optimist.usage('Usage: $0 --host [host] --port [port] --topic [topic]').
    default('port', kafkaConfig.port).
    default('host', kafkaConfig.host).
    default('topic', kafkaConfig.topic).argv;

    var producer = new Producer({
      host: argv.host,
      port: argv.port
    }, function(success) {

      if (success) {
        var produceRequest = {
          requiredAcks: 1,
          timeout: 10000,
          topics: [{
            topicName: argv.topic,
            partitions: [{
              partitionId: 0,
              messages: [{
                value: JSON.stringify(rec)
              }]
            }]
          }]
        }

        producer.produce(produceRequest, function(response) {
          producer.close();

          if (response && response.topicsAndPartitions && (response.topicsAndPartitions instanceof Array) && response.topicsAndPartitions[0] && response.topicsAndPartitions[0].partitions && (response.topicsAndPartitions[0].partitions instanceof Array) && response.topicsAndPartitions[0].partitions[0].errorCode === 0) {

            var msg = stylizeWithColor("send log to kafka successfull\n", colorFromLevel[rec.level]);
            process.stdout.write(msg);

          } else {

            var msg = stylizeWithColor("send log to kafka failed\n", colorFromLevel[rec.level]);
            process.stdout.write(msg);

          }
        })

      } else {
        var msg = stylizeWithColor("connect to kafka failed\n", colorFromLevel[rec.level]);
        process.stdout.write(msg);
      }

    });
  }

  function _toKafkaHTTP(rec) {

    var str = JSON.stringify(rec);
    var buf = new Buffer(str);
    var data = buf.toString('base64');

    var request = {
      "records": [{
        "value": data
      }]
    };

    http({
      url: config.report.kafkaUrl,
      method: 'POST',
      body: request,
      json: true,
      headers: {
        'Content-Type': 'application/vnd.kafka.binary.v1+json'
      }
    }, function(err, res, result) {

      if (err) {
        process.stderr.write(JSON.stringify(err) + '\n');
      }

    });
  }

  //=== 日志接口 ===//
  var LoggerNode = {};
  var logger;
  LoggerNode.createLogger = function(_config) {

    config = _config;
    if (config.stdout && config.stdout == 'false') config.stdout = false;
    if (config.json && config.json == 'false') config.json = false;
    if (config.db && config.db == 'false') config.db = false;
    if (config.kafka && config.kafka == 'false') config.kafka = false;
    if (config.kafkaHTTP && config.kafkaHTTP == 'false') config.kafkaHTTP = false;

    logger = bunyan.createLogger({
      name: config.name,
      src: true,
      streams: [{
        level: root.config.level,
        stream: new MyRawStream(),
        type: 'raw'
      }]
    });

    return logger;
  }

  LoggerNode.getLogger = function() {
    return logger;
  }

  module.exports = LoggerNode;

})();
