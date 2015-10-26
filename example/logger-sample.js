

var loggerConfig = require('./logger-config');
var loggerNode = require('../lib/logger-node');

var logger1 = loggerNode.createLogger(loggerConfig);
logger1.info('hi');

var logger2 = loggerNode.getLogger();
function hello() {
	logger2.debug('hi');
}
hello();
