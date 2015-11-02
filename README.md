# logger-node

基于bunyan的日志系统，可以输出比较漂亮的打印日志格式，也可以输出成JSON格式、还可以输出到mongodb数据库，以及kafka系统。

## 安装日志处理器

1、如下所示，需要所开发的nodejs工程内，打开package.json。里面加入日志系统地址

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
    "logger-node":"git://github.com/gfound/logger-node.git#v1.0.2"
  }
```

2、使用NPM安装

```
npm install
```

## 日志配置

```
module.exports = {
  name: process.env.LOG_NAME || 'loggerSample', //日志名称，建议与工程名称一致
  level: process.env.LOG_LEVEL || 'trace',      //输出的日志级别, trace、debug、info、warn、error、fatal

  //输出到控制台
  stdout: process.env.LOG_STOUT || true,  //是否输出到控制台
  json: process.env.LOG_JSON || false,    //如果是，是否输出成JSON格式

  //输出到Kafka
  kafka: process.env.LOG_KAFKA || true,   //是否输出到kafka
  kafkaUrl: process.env.LOG_KAFKA_URL || 'http://localhost:8082/topics/test', //kafka输入的地址
  
  //输出到mongodb数据库
  db: process.env.LOG_DB || true, //是否输出到mongodb
  dbConfig: {
    host: process.env.LOG_DB_HOST || '127.0.0.1', //mongodb服务器地址
    port: process.env.LOG_DB_PORT || 27017,       //mongodb服务器端口
    user: process.env.LOG_DB_USER || '',          //mongodb用户名
    password: process.env.LOG_DB_PASSWORD || '',  //mongodb密码
    database: process.env.LOG_DB_NAME || 'logs'   //mongodb数据库名
  }
}
```

## 创建日志处理器

创建一个日志处理器。

```
var loggerConfig = require('./logger-config');  //日志配置
var loggerNode = require('../lib/logger-node');

var logger = loggerNode.createLogger(loggerConfig);
```


## 使用日志日志处理器

创建成功后，无需反复创建，可以通过直接获得日志处理器。


```
var loggerNode = require('../lib/logger-node');
var logger = loggerNode.getLogger();
```

调用日志

```
logger.trace('hi');

logger.debug('hi');

logger.info('hi');

logger.warn('hi');

logger.error('hi');

logger.fatal('hi');

```

也可以加入自定义的JSON内容。当日志输出到mongodb、json、kafka中，就可以看到加入的json内容。
```
logger.trace({username, 'test1'}, 'hi');

logger.debug({username, 'test1'}, 'hi');

logger.info({username, 'test1'}, 'hi');

logger.warn({username, 'test1'}, 'hi');

logger.error({username, 'test1'}, 'hi');

logger.fatal({username, 'test1'}, 'hi');

```



