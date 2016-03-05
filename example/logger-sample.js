var os = require("os")

var loggerConfig = require('./logger-config');
var loggerNode = require('../lib/logger-node');

var logger = loggerNode.createLogger(loggerConfig);

logger.info('hi');

var logger2 = loggerNode.getLogger();

function hello() {
  logger2.debug('hi');
}
hello();

var callLog = {};
callLog.report = true;
callLog.content = "test中文";
callLog.from = "admin"
callLog.to = "189"
callLog.msgType = "audio";
callLog.timestamp = "2016-02-22 11:34:34.854";
callLog.action = "receive";
callLog.module = "callServer-" + os.hostname();

logger.info({report:"kafka"}, callLog)
