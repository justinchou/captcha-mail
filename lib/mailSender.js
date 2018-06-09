const EventEmitter = require('events').EventEmitter;
const sgMail       = require('@sendgrid/mail');
const Is           = require('is');
// const Logger       = require('log4js');
const Logger       = require('pomelo-logger');

const logger = Logger.getLogger('captcha-mail', 'mailSender');

class MailSender extends EventEmitter {

  constructor(config) {
    super();

    this.config = config;
  }

  init() {
    sgMail.setApiKey(this.config.apikey);

    return this;
  }

  async sendCaptcha (email, captcha) {
    let receivers = Is.array(email) ? email : [email];
    const msg = {
      to:      receivers,
      from:    this.config.template.sender,
      subject: this.config.template.subject,
      text:    this.config.template.text.replace('${captcha}', captcha),
      html:    this.config.template.html.replace('${captcha}', captcha),
    };
  
    const resp = await sgMail.send(msg);
    logger.debug('ObjKeys [ %j ] Err: ', Object.keys(resp['0']), resp['1'])
  }

}

module.exports = MailSender;
