# logger-node

基于bunyan的日志系统，可以输出比较漂亮的打印日志格式，也可以输出成JSON格式。

## 安装日志处理器

1、如下所示，在package.json里面加入地址

```
{
  "name": "TcpNode",
  "version": "1.0.0",
  "description": "",
  "private": true,
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "jinlei",
  "dependencies": {
    "logger-node":"git://github.com/gfound/logger-node.git"
  }
```

2、使用NPM安装

```
npm install
```

## 创建日志处理器

创建一个日志处理器。

```
var loggerConfig = require('./logger-config');	//日志配置
var loggerNode = require('../lib/logger-node');

var logger = loggerNode.createLogger(loggerConfig);
```
日志的使用方法参考bunyan的说明。


## 日志配置

```
{
	name: process.env.LOG_NAME || 'logger-sample',		//日志名称，建议与工程名称一致。
	level: process.env.LOG_LEVEL || 'trace',			//输出的日志级别, trace、debug、info、warn、error、fatal

	loggerService: process.env.LOGGER_SERVICE || '',	//日志服务

	stdout: process.env.LOG_STOUT || true,				//是否输出日志到控制台
	json: process.env.LOG_JSON || false					//是否输出到控制台的日志为JSON格式
}
```

## 获取日志日志处理器

如果创建成功，无需反复创建。

```
var loggerNode = require('../lib/logger-node');
var logger = loggerNode.getLogger();
```

