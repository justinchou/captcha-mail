const MailSender = require('./index').MailSender;
const Captcha    = require('./index').Captcha;
const debug      = require('debug')('captcha-mail');

const config     = require('config');

(async () => {
  const email = config.captcha.template.sender;

  const captchaIns = new Captcha(config.captcha).init();
  const mailSenderIns = new MailSender(config.captcha).init();

  // Genetate Captcha
  const captcha = await captchaIns.generateCaptcha(email, 6);
  debug('My Captcha Is %s', captcha);

  mailSenderIns.sendCaptcha(email, captcha);

  // Validate Captcha
  const valid = await captchaIns.validateCaptcha(email, captcha);
  debug('Captcha Valide Is:', valid);

  process.nextTick(() => {
    captchaIns.destroy();
  });
})();
