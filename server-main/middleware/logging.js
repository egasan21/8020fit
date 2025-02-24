const winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/error.log'), 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/wger.log')
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

const wgerLogger = async (req, res, next) => {
  const startTime = Date.now();
  const requestLog = {
    method: req.method,
    path: req.path,
    params: req.params,
    query: req.query,
    body: req.body,
    userId: req.user?.id || 'anonymous'
  };

  logger.info('Incoming request', { request: requestLog });

  const originalSend = res.json;
  res.json = function(body) {
    const responseLog = {
      statusCode: res.statusCode,
      responseTime: Date.now() - startTime,
      body: body
    };
    
    logger.info('Outgoing response', { 
      response: responseLog,
      request: requestLog 
    });
    
    originalSend.call(this, body);
  };

  next();
};

module.exports = { wgerLogger, logger };