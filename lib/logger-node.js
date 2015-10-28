var bunyan = require('bunyan');


(function() {

	var root = this;

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
		40: 'magenta', // WARN
		50: 'red', // ERROR
		60: 'inverse', // FATAL
	};

	var nameFromLevel = {
		10: 'TRACE', // TRACE
		20: 'DEBUG', // DEBUG
		30: ' INFO', // INFO
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

		//日志输出到日志服务器


		if (config.stdout) {
			//日志打印到控制台
			if (config.json) { //打印成JSON格式
				process.nextTick(function() {
					process.stdout.write(JSON.stringify(rec) + '\n');
				});

			} else { //打印成标准样式
				process.nextTick(function() {
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
				});
			}
		}

	}

	//=== 日志接口 ===//

	var LoggerNode = {};
	var logger;
	LoggerNode.createLogger = function(_config) {

		config = _config;

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