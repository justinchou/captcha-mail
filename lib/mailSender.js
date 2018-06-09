const config = require('config');
const sgMail = require('@sendgrid/mail');
// const Logger = require('log4js');
const Logger = require('pomelo-logger');

const logger = Logger.getLogger('captcha-mail', 'mailSender');

sgMail.setApiKey(config.captcha.apikey);

exports.sendCaptcha = async (email, captcha) => {
  const msg = {
    to:      [email],
    from:    config.captcha.template.sender,
    subject: config.captcha.template.subject,
    text:    config.captcha.template.text.replace('${captcha}', captcha),
    html:    config.captcha.template.html.replace('${captcha}', captcha),
  };

  const resp = await sgMail.send(msg);
  logger.debug('ObjKeys [ %j ] Err: ', Object.keys(resp['0']), resp['1'])
};

