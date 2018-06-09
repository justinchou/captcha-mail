const MailSender = require('./index').MailSender;
const Captcha    = require('./index').Captcha;
// const Logger     = require('log4js');
const Logger     = require('pomelo-logger');

const config     = require('config');
const logger     = Logger.getLogger('captcha-mail');

(async () => {
  const email = config.captcha.template.sender;

  const captchaIns = new Captcha(config.captcha).init();

  // Genetate Captcha
  const captcha = await captchaIns.generateCaptcha(email, 6);
  logger.debug('My Captcha Is %s', captcha);

  MailSender.sendCaptcha(email, captcha);

  // Validate Captcha
  const valid = await captchaIns.validateCaptcha(email, captcha);
  logger.debug('Captcha Valide Is:', valid);

  process.nextTick(() => {
    captchaIns.destroy();
  });
})();
