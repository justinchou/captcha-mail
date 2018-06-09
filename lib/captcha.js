const Redis        = require('redis');
const Bluebird     = require('bluebird');
const Is           = require('is');
const EventEmitter = require('events').EventEmitter;
// const Logger       = require('log4js');
const Logger       = require('pomelo-logger');

Bluebird.promisifyAll(Redis);
const logger       = Logger.getLogger('captcha-mail', 'captcha');

class Captcha extends EventEmitter {

  constructor (config) {
    super();

    this.config          = config;

    this.randomStrSource = '0123456789';
    this.cachePrefix     = 's_validateCode:';

    this.redis           = null;
  }

  init () {
    if (this.config.randomStrSource && Is.string(this.config.randomStrSource)) this.randomStrSource = this.config.randomStrSource;
    if (this.config.cachePrefix && Is.string(this.config.cachePrefix))         this.cachePrefix     = this.config.cachePrefix;

    this.redis = this.config.redis ? Redis.createClient(this.config.redis) : Redis.createClient();
    this.redis.on('connect',   () => {logger.info('Connecting To Server [ %j ]', this.config.redis || {}); });
    this.redis.on('ready',     () => {logger.info('Ready To Comunicate.'); });
    this.redis.on('reconnect', (...args) => {logger.warn('Connection Broke, Reconnecting... [ %j ]', args); });
    this.redis.on('warning',   (msg) => {logger.warn('Warning: ', msg); });
    this.redis.on('error',     (msg) => {logger.error('Error: ', msg); });
    this.redis.on('end',       () => {logger.warn('Connection Ends.'); });

    return this;
  }

  destroy () {
    if (this.redis && this.redis.connected) this.redis.end(true);
  }
  
  async generateCaptcha (email, len) {
    const maxLen = this.randomStrSource.length;
  
    const captchaArr = [];
    for (let lIdx = 0; lIdx < len; lIdx++) {
      const currentId   = Math.floor(Math.random() * maxLen);
      const currentChar = this.randomStrSource[currentId];
      captchaArr.push(currentChar);
    }

    const captcha = captchaArr.join('');
    await this.redis.setAsync(`${this.cachePrefix}${email}`, `${captcha}`);
    logger.debug('Generate Captcha [ %s ] Store In Redis Key [ get %s ]', captcha, `${this.cachePrefix}${email}`);
  
    return captcha;
  };
  
  async loadCaptcha (email) {
    const captcha = await this.redis.getAsync(`${this.cachePrefix}${email}`);

    return captcha;
  }
  
  async validateCaptcha (email, captcha) {
    const captchaValidate = await this.loadCaptcha(email);

    return captcha === captchaValidate;
  }

}

module.exports = Captcha;
