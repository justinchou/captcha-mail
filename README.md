Captcha Mail Sender
===

## Quick Start

### Include The Package

```js
const {MailSender, Captcha} = require('captcha-mail');
```

### Do The Config

The Required Config As Bellow:

```js
const config = {
  apikey:          'SG.*** Your SendGrid API Key See: https://sendgrid.com/',
  randomStrSource: '1234567890',
  template: {
    subject: 'WumingXiaozu.com Registry Captcha',
    sender:  'wumingxiaozu@wumingxiaozu.com',
    text:    'Your Captcha Is <strong>${captcha}</strong>', 
    html:    'Registry Captcha <strong>${captcha}</strong> From WumingXiaozu.com, Please Enter Into Login Box.',
  },
  redis: {
    host: '127.0.0.1',
    port: 6379
  }
};
```

* apikey: string, send grid mail private key, get it from here: https://sendgrid.com/
* randomStrSource: string, from which we generate the captcha.
* template: object, the email template.
* redis: object, redis connector.

NOTE: BE AWAIR OF THAT, THE **${captcha}** PART WILL BE REPLACED BY REAL CAPTCHA.

### Calling Demo

```
// Define The Receiver.
const email = 'wumingxiaozu@wumingxiaozu.com';
```

```js
// Init The Captcha Object
const captchaIns = new Captcha(config).init();
```

#### When Generate Captcha And Send Email

```
// Generate The Code And Store Into Redis.
const captcha = await captchaIns.generateCaptcha(email, 6);
console.log('My Captcha Is %s', captcha);

// Send Email To Receiver.
MailSender.sendCaptcha(email, captcha);
```

#### When Validate The Captcha

```
const valid = await captchaIns.validateCaptcha(email, captcha);
console.log('Captcha Validate Is:', valid);
```

